<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Mail;
use Exception; 



class Application extends Model
{
    protected $table = 'applications';

    protected $fillable = [
        'user_id',
        'type',
        'data',
        'status',
        'current_level'
    ];

    protected $casts = [
        'data' => 'array'
    ];

    public function logs()
    {
        return $this->hasMany(ApplicationLog::class, 'application_id');
    }
}

class ApplicationLog extends Model
{
    protected $table = 'application_logs';

    protected $fillable = [
        'application_id',
        'from_level',
        'to_level',
        'action',
        'actor_id',
        'comment'
    ];

    public function signatures()
    {
        return $this->hasMany(ApplicationSignature::class, 'application_log_id');
    }
}

class ApplicationSignature extends Model
{
    protected $table = 'application_signatures';

    protected $fillable = [
        'application_id',
        'application_log_id',
        'actor_id',
        'level',
        'signature_data',
        'meta_data'
    ];

    protected $casts = [
        'meta_data' => 'array'
    ];
}




class ApplicationWorkflow
{
   

    private function logAction(
        Application $app,
        ?int $from,
        ?int $to,
        string $action,
        int $actorId,
        ?string $comment = null
    ): ApplicationLog {
        return $app->logs()->create([
            'from_level' => $from,
            'to_level'   => $to,
            'action'     => $action,
            'actor_id'   => $actorId,
            'comment'    => $comment
        ]);
    }

    private function requiresSignature(int $level): bool
    {
        return DB::table('workflow_levels')
            ->where('level', $level)
            ->value('req_sign') === 1;
    }

    private function verifySignature(?string $signature): bool
    {
        if (!$signature) return false;
        if (str_starts_with($signature, 'data:image/')) return true;
        return base64_decode($signature, true) !== false;
    }

    private function signatureMeta(): array
    {
        return [
            'ip' => Request::ip() ?? 'cli',
            'ua' => Request::userAgent() ?? 'cli'
        ];
    }

    private function ensureNotFinal(Application $app): void
    {
        if (in_array($app->status, ['approved', 'rejected'], true)) {
            throw new Exception('Application already finalized');
        }
    }

    private function hasPendingConsultation(Application $app): bool
    {
        return DB::table('consultations')
            ->where('application_id', $app->id)
            ->where('status', 'pending')
            ->exists();
    }

    

    public function createApplication(int $userId, string $type, array $data): Application
    {
        return DB::transaction(function () use ($userId, $type, $data) {

            $app = Application::create([
                'user_id'       => $userId,
                'type'          => $type,
                'data'          => $data,
                'status'        => 'draft',
                'current_level' => 1
            ]);

            $this->logAction($app, null, 1, 'created', $userId, 'Application created');

            return $app;
        });
    }

    public function submitApplication(Application $app): bool
    {
        if ($app->status !== 'draft') return false;

        $app->update([
            'status'        => 'submitted',
            'current_level' => 2
        ]);

        return true;
    }

    public function forwardApplication(
        Application $app,
        int $actorId,
        int $fromLevel,
        int $toLevel,
        ?string $comment,
        ?string $signature
    ): void {
        DB::transaction(function () use ($app, $actorId, $fromLevel, $toLevel, $comment, $signature) {

            $this->ensureNotFinal($app);

            if ($this->hasPendingConsultation($app)) {
                throw new Exception('Pending consultation must be resolved first');
            }

            if ($this->requiresSignature($fromLevel) && !$this->verifySignature($signature)) {
                throw new Exception('Valid signature required');
            }

            $app->update([
                'current_level' => $toLevel,
                'status'        => 'inReview'
            ]);

            $log = $this->logAction($app, $fromLevel, $toLevel, 'forwarded', $actorId, $comment);

            if ($signature) {
                $log->signatures()->create([
                    'application_id'     => $app->id,
                    'application_log_id' => $log->id,
                    'actor_id'           => $actorId,
                    'level'              => $fromLevel,
                    'signature_data'     => $signature,
                    'meta_data'          => $this->signatureMeta()
                ]);
            }
        });
    }

    public function backwardApplication(
        Application $app,
        int $actorId,
        int $fromLevel,
        int $toLevel,
        ?string $comment,
        ?string $signature
    ): void {
        DB::transaction(function () use ($app, $actorId, $fromLevel, $toLevel, $comment, $signature) {

            $this->ensureNotFinal($app);

            if ($this->hasPendingConsultation($app)) {
                throw new Exception('Pending consultation must be resolved first');
            }

            if ($this->requiresSignature($fromLevel) && !$this->verifySignature($signature)) {
                throw new Exception('Valid signature required');
            }

            $app->update([
                'current_level' => $toLevel,
                'status'        => 'inReview'
            ]);

            $log = $this->logAction($app, $fromLevel, $toLevel, 'backward', $actorId, $comment);

            if ($signature) {
                $log->signatures()->create([
                    'application_id'     => $app->id,
                    'application_log_id' => $log->id,
                    'actor_id'           => $actorId,
                    'level'              => $fromLevel,
                    'signature_data'     => $signature,
                    'meta_data'          => $this->signatureMeta()
                ]);
            }
        });
    }

    public function rejectApplication(
        Application $app,
        int $actorId,
        int $fromLevel,
        string $reason,
        ?string $signature
    ): void {
        DB::transaction(function () use ($app, $actorId, $fromLevel, $reason, $signature) {

            $this->ensureNotFinal($app);

            if ($this->hasPendingConsultation($app)) {
                throw new Exception('Pending consultation must be resolved first');
            }

            if ($this->requiresSignature($fromLevel) && !$this->verifySignature($signature)) {
                throw new Exception('Valid signature required');
            }

            $app->update(['status' => 'rejected']);

            $log = $this->logAction($app, $fromLevel, null, 'rejected', $actorId, $reason);

            if ($signature) {
                $log->signatures()->create([
                    'application_id'     => $app->id,
                    'application_log_id' => $log->id,
                    'actor_id'           => $actorId,
                    'level'              => $fromLevel,
                    'signature_data'     => $signature,
                    'meta_data'          => $this->signatureMeta()
                ]);
            }
        });
    }

    

    public function generateConsultation(
        Application $app,
        int $requestedBy,
        int $requestedTo,
        string $message
    ): void {
        DB::transaction(function () use ($app, $requestedBy, $requestedTo, $message) {

            DB::table('consultations')->insert([
                'application_id' => $app->id,
                'requested_by'   => $requestedBy,
                'requested_to'   => $requestedTo,
                'message'        => $message,
                'status'         => 'pending',
                'created_at'     => now()
            ]);

            $email = DB::table('users')->where('id', $requestedTo)->value('email');

            Mail::raw(
                "Consultation requested for Application #{$app->id}\n\n{$message}",
                fn ($mail) =>
                    $mail->to($email)->subject('Application Consultation Request')
            );
        });
    }

    public function respondToConsultation(
        int $consultationId,
        int $responderId,
        string $response
    ): void {
        DB::transaction(function () use ($consultationId, $responderId, $response) {

            $consult = DB::table('consultations')
                ->where('id', $consultationId)
                ->where('status', 'pending')
                ->lockForUpdate()
                ->first();

            if (!$consult) {
                throw new Exception('Consultation not found or already resolved');
            }

            DB::table('consultations')->where('id', $consultationId)->update([
                'response'     => $response,
                'status'       => 'responded',
                'responded_at' => now()
            ]);

            $email = DB::table('users')->where('id', $consult->requested_by)->value('email');

            Mail::raw(
                "Consultation response for Application #{$consult->application_id}\n\n{$response}",
                fn ($mail) =>
                    $mail->to($email)->subject('Consultation Response Received')
            );
        });
    }
}
