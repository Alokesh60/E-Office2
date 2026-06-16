<!DOCTYPE html>
<html>

<head>
  <title>Responses</title>
</head>

<body>

  <h2>{{ $form->title }} - Responses</h2>

  <p><strong>Total Responses:</strong> {{ $form->responses->count() }}</p>

  <hr>

  @foreach($form->responses as $response)
  <div style="border:1px solid #ccc; padding:15px; margin-bottom:20px; border-radius:8px;">

    <h4>Response #{{ $response->id }}</h4>
    <p><small>{{ $response->created_at->format('d M Y, h:i A') }}</small></p>

    <hr>

    @foreach($response->answers as $answer)
    <div style="margin-bottom:10px;">

      <strong>
        {{ $answer->field->label ?? 'Question' }}
      </strong><br>

      {{ $answer->answer_text ?? 'No answer' }}

    </div>
    @endforeach

  </div>
  @endforeach

</body>

</html>