import React, { useState, useEffect } from "react";
import styles from "./AdminApplication.module.css";

const availableRoles = [
  "director",
  "dean_academic",
  "dean_faculty_welfare",
  "dean_alumni_relations",
  "dean_planing_development",
  "dean_student_welfare",
  "dean_research_consultancy",
  "registrar",
  "associate_dean",
  "hod_maths",
  "hod_physics",
  "hod_chemistry",
  "hod_humanities",
  "hod_mba",
  "hod_cse",
  "hod_EIE",
  "hod_mech",
  "hod_ece",
  "hod_elec",
  "hod_civil",
  "associate_dean_sw",
  "associate_dean_rc",
  "associate_dean_ar",
  "associate_dean_pd",
  "associate_dean_ac",
  "associate_dean_fw",
  "deputy_registrar",
  "assistant_registrar",
  "warden",
  "account_officer",
  "officer",
];

const mapBackendType = (type) => {
  switch (type) {
    case "text":
      return "short";
    case "textarea":
      return "para";
    case "email":
      return "email";
    case "number":
      return "number";
    case "date":
      return "date";
    case "dropdown":
      return "dropdown";
    case "radio":
      return "radio";
    case "checkbox":
      return "checkbox";
    case "file":
      return "file";
    default:
      return "short";
  }
};

const FIELD_TYPES = {
  short: { label: "Short answer", icon: "Aa" },
  para: { label: "Paragraph", icon: "¶" },
  number: { label: "Number", icon: "#" },
  email: { label: "Email", icon: "@" },
  date: { label: "Date", icon: "📅" },
  dropdown: { label: "Dropdown", icon: "▾" },
  radio: { label: "Multiple choice", icon: "◉" },
  checkbox: { label: "Checkboxes", icon: "☑" },
  file: { label: "File upload", icon: "📎" },
};

let globalFieldCounter = 0;
function makeField(type) {
  globalFieldCounter += 1;
  return {
    id: `f${globalFieldCounter}`,
    type,
    label: "",
    required: false,
    options: ["Option 1", "Option 2", "Option 3"],
  };
}

// ─── AdminApplication ────────────────────────────────────────────────────────
const AdminApplication = () => {
  const [forms, setForms] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [activeTab, setActiveTab] = useState("builder"); // "builder" or "workflow"
  const [fields, setFields] = useState([]);
  const [activeFieldId, setActiveFieldId] = useState(null);
  const [formDesc, setFormDesc] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [workflow, setWorkflow] = useState([]);
  const [roleSearch, setRoleSearch] = useState("");

  const addRoleToWorkflow = (role) =>
    setWorkflow((prev) => (prev.includes(role) ? prev : [...prev, role]));
  const filteredRoles = availableRoles.filter((role) =>
    role.toLowerCase().includes(roleSearch.toLowerCase()),
  );
  const removeRoleFromWorkflow = (role) =>
    setWorkflow((prev) => prev.filter((r) => r !== role));

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/forms");
      const data = await res.json();
      setForms(
        data.map((f) => ({
          id: f.id,
          title: f.name,
          description: f.description,
          rawFields: f.fields,
          backendId: f.id,
          icon: "ri-file-list-3-line",
          color: "#2563eb", // Using a solid primary color for all cards to match the new UI
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const openBuilder = (form) => {
    setActiveForm(form);
    setActiveTab("builder");
    if (form.rawFields && form.rawFields.length > 0) {
      const mappedFields = form.rawFields.map((f) => ({
        id: `f_${f.id}`,
        type: mapBackendType(f.field_type),
        label: f.label,
        required: f.required,
        options: f.options || ["Option 1", "Option 2"],
      }));
      setFields(mappedFields);
    } else {
      setFields([]);
    }
    setFormDesc(form.description || "");
    setActiveFieldId(null);
  };

  const closeBuilder = () => setActiveForm(null);

  const confirmDelete = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/api/forms/${deleteTarget.id}`, {
        method: "DELETE",
      });
      await loadForms();
      showToast(`Deleted "${deleteTarget.title}"`);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast("Error deleting form");
    }
  };

  const addField = (type) => {
    const f = makeField(type);
    setFields((prev) => [...prev, f]);
    setActiveFieldId(f.id);
  };

  const delField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (activeFieldId === id) setActiveFieldId(null);
  };

  const dupField = (id) => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const clone = {
        ...prev[idx],
        id: `f${++globalFieldCounter}`,
        options: [...prev[idx].options],
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      setActiveFieldId(clone.id);
      return next;
    });
  };

  const updateField = (id, patch) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );

  const updateOption = (fieldId, idx, val) =>
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        const opts = [...f.options];
        opts[idx] = val;
        return { ...f, options: opts };
      }),
    );

  const addOption = (fieldId) =>
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? { ...f, options: [...f.options, `Option ${f.options.length + 1}`] }
          : f,
      ),
    );

  const removeOption = (fieldId, idx) =>
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId && f.options.length > 1
          ? { ...f, options: f.options.filter((_, i) => i !== idx) }
          : f,
      ),
    );

  const mapType = (type) => {
    switch (type) {
      case "short":
        return "text";
      case "para":
        return "textarea";
      case "email":
        return "email";
      case "number":
        return "number";
      case "date":
        return "date";
      case "dropdown":
        return "dropdown";
      case "radio":
        return "radio";
      case "checkbox":
        return "checkbox";
      case "file":
        return "file";
      default:
        return "text";
    }
  };

  const saveForm = async () => {
    if (saving) return;
    setSaving(true);
    try {
      let formId;
      if (!activeForm.isNew && !isNaN(activeForm.backendId)) {
        await fetch(`http://127.0.0.1:8000/api/forms/${activeForm.backendId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: activeForm.title,
            description: formDesc,
            workflow: workflow,
          }),
        });
        formId = activeForm.backendId;
        await fetch(
          `http://127.0.0.1:8000/api/forms/${activeForm.backendId}/fields`,
          { method: "DELETE" },
        );
      } else {
        const formRes = await fetch("http://127.0.0.1:8000/api/forms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: activeForm.title,
            description: formDesc,
            created_by: 1,
            workflow: workflow,
          }),
        });
        const data = await formRes.json();
        formId = data.id;
      }

      const fieldPromises = fields.map((f, index) => {
        return fetch("http://127.0.0.1:8000/api/form-fields", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            form_id: formId,
            label: f.label || `Question ${index + 1}`,
            field_name: `field_${index + 1}`,
            field_type: mapType(f.type),
            required: f.required,
            options: ["dropdown", "radio", "checkbox"].includes(f.type)
              ? JSON.stringify(f.options)
              : null,
            field_order: index,
            is_primary: index === 0,
          }),
        });
      });

      await Promise.all(fieldPromises);
      showToast("Form saved successfully!");
      await loadForms();
      closeBuilder();
    } catch (err) {
      console.error(err);
      showToast("Error saving form");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <h2 className={styles.heading}>Manage Application Forms</h2>
        <div className={styles.grid}>
          {/* Custom Form Card */}
          <div
            className={styles.card}
            style={{
              border: "2px dashed #cbd5e1",
              background: "transparent",
              boxShadow: "none",
            }}
          >
            <div className={styles.cardTop}>
              <div
                className={styles.iconBox}
                style={{ backgroundColor: "#94a3b8" }}
              >
                <i className="ri-add-line"></i>
              </div>
              <div className={styles.cardText}>
                <h3 style={{ color: "#64748b" }}>Create Custom Form</h3>
                <p>Build a new application from scratch</p>
              </div>
            </div>
            <button
              className={styles.fillBtn}
              onClick={() => {
                const newForm = {
                  id: Date.now(),
                  title: "Untitled Form",
                  icon: "ri-file-add-line",
                  color: "#2563eb",
                  fields: 0,
                  isNew: true,
                };
                setForms([...forms, newForm]);
                openBuilder(newForm);
              }}
            >
              <i className="ri-add-circle-line"></i> Start New Form
            </button>
          </div>

          {forms.map((form) => (
            <div key={form.id} className={styles.card}>
              <button
                className={styles.deleteBtn}
                title="Delete Form"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget({ id: form.id, title: form.title });
                }}
              >
                <i className="ri-delete-bin-line"></i>
              </button>
              <div className={styles.cardTop}>
                <div
                  className={styles.iconBox}
                  style={{ backgroundColor: form.color }}
                >
                  <i className={form.icon}></i>
                </div>
                <div className={styles.cardText}>
                  <h3>{form.title}</h3>
                  <p>
                    {form.rawFields?.length > 0
                      ? `${form.rawFields.length} configured fields`
                      : "No questions configured yet"}
                  </p>
                </div>
              </div>
              <button
                className={styles.fillBtn}
                onClick={() => openBuilder(form)}
              >
                <i className="ri-settings-4-line"></i> Configure Form
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Form Builder Modal */}
      {activeForm && (
        <div className={styles.modalOverlay} onClick={closeBuilder}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.headerLeft}>
                <div
                  className={styles.headerIcon}
                  style={{ backgroundColor: activeForm.color }}
                >
                  <i className={activeForm.icon}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    className={styles.titleInput}
                    value={activeForm.title}
                    placeholder="Enter form title..."
                    onChange={(e) =>
                      setActiveForm({ ...activeForm, title: e.target.value })
                    }
                  />
                  <textarea
                    className={styles.descInput}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Provide instructions or context for students applying to this form..."
                    rows={1}
                  />
                </div>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.closeBtn} onClick={closeBuilder}>
                  <i className="ri-close-line"></i>
                </button>
                <button className={styles.saveBtn} onClick={() => saveForm()}>
                  <i className="ri-save-line"></i>{" "}
                  {saving ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className={styles.tabsContainer}>
              <div
                className={`${styles.tab} ${activeTab === "builder" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("builder")}
              >
                <i className="ri-file-list-2-line"></i> Form Builder
              </div>
              <div
                className={`${styles.tab} ${activeTab === "workflow" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("workflow")}
              >
                <i className="ri-flow-chart"></i> Approval Workflow
              </div>
            </div>

            {/* Modal Body / Tab Content */}
            <div className={styles.modalBody}>
              {/* TAB 1: FORM BUILDER */}
              {activeTab === "builder" && (
                <>
                  <FieldPalette onAdd={addField} />
                  <div className={styles.canvas}>
                    <div className={styles.canvasInner}>
                      {fields.length === 0 ? (
                        <EmptyCanvas onAdd={addField} />
                      ) : (
                        fields.map((f, i) => (
                          <FieldCard
                            key={f.id}
                            field={f}
                            index={i}
                            active={f.id === activeFieldId}
                            onSelect={() =>
                              setActiveFieldId(
                                f.id === activeFieldId ? null : f.id,
                              )
                            }
                            onDelete={() => delField(f.id)}
                            onDuplicate={() => dupField(f.id)}
                            onUpdate={(patch) => updateField(f.id, patch)}
                            onUpdateOption={(idx, val) =>
                              updateOption(f.id, idx, val)
                            }
                            onAddOption={() => addOption(f.id)}
                            onRemoveOption={(idx) => removeOption(f.id, idx)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: WORKFLOW */}
              {activeTab === "workflow" && (
                <div className={styles.workflowTab}>
                  {/* Roles Sidebar */}
                  <div className={styles.workflowSidebar}>
                    <div className={styles.workflowSidebarHeader}>
                      <h3 style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                        Available Roles
                      </h3>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#64748b",
                          marginTop: 4,
                        }}
                      >
                        Select roles to add to the approval chain.
                      </p>
                      <input
                        className={styles.workflowSearch}
                        type="text"
                        placeholder="Search roles..."
                        value={roleSearch}
                        onChange={(e) => setRoleSearch(e.target.value)}
                      />
                    </div>
                    <div className={styles.roleList}>
                      {filteredRoles.length === 0 ? (
                        <p
                          style={{
                            textAlign: "center",
                            color: "#94a3b8",
                            padding: "20px 0",
                          }}
                        >
                          No roles found
                        </p>
                      ) : (
                        filteredRoles.map((role) => {
                          const isAdded = workflow.includes(role);
                          return (
                            <div
                              key={role}
                              className={`${styles.roleItem} ${isAdded ? styles.roleAdded : ""}`}
                              onClick={() =>
                                !isAdded && addRoleToWorkflow(role)
                              }
                            >
                              <span>
                                {role
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                              {isAdded ? (
                                <i className="ri-check-line"></i>
                              ) : (
                                <i className="ri-add-line"></i>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Workflow Sequence Canvas */}
                  <div className={styles.workflowCanvas}>
                    <h2
                      style={{
                        fontSize: "1.4rem",
                        color: "#0f172a",
                        marginBottom: 8,
                      }}
                    >
                      Approval Sequence
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                      Forms will be routed to these authorities in the exact
                      order shown below.
                    </p>

                    {workflow.length === 0 ? (
                      <div className={styles.workflowEmpty}>
                        <i
                          className="ri-route-line"
                          style={{
                            fontSize: "3rem",
                            color: "#cbd5e1",
                            marginBottom: 16,
                            display: "block",
                          }}
                        ></i>
                        <h3>No approval workflow defined</h3>
                        <p style={{ marginTop: 8 }}>
                          Click roles on the left to build the approval
                          sequence.
                        </p>
                      </div>
                    ) : (
                      <div className={styles.workflowSequence}>
                        {workflow.map((role, idx) => (
                          <React.Fragment key={role}>
                            <div className={styles.workflowStep}>
                              <div className={styles.stepNumber}>{idx + 1}</div>
                              <div className={styles.stepName}>
                                {role.replace(/_/g, " ")}
                              </div>
                              <button
                                className={styles.stepRemove}
                                onClick={() => removeRoleFromWorkflow(role)}
                              >
                                <i className="ri-close-circle-line"></i>
                              </button>
                            </div>
                            {idx < workflow.length - 1 && (
                              <div className={styles.stepConnector}></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toastMsg && <div className={styles.toastMsg}>{toastMsg}</div>}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className={styles.modal}
            style={{ maxWidth: 450, height: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader} style={{ padding: "24px" }}>
              <h3 style={{ fontSize: 20 }}>Confirm Deletion</h3>
            </div>
            <div style={{ padding: "24px", fontSize: 16, flex: 1 }}>
              <p>
                Are you sure you want to permanently delete{" "}
                <strong>{deleteTarget.title}</strong>? This action cannot be
                undone.
              </p>
            </div>
            <div
              className={styles.modalHeader}
              style={{
                padding: "20px 24px",
                justifyContent: "flex-end",
                gap: 12,
                borderTop: "1px solid #e2e8f0",
                borderBottom: "none",
              }}
            >
              <button
                className={styles.closeBtn}
                style={{ width: "auto", padding: "0 20px" }}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className={styles.saveBtn}
                style={{ background: "#ef4444" }}
                onClick={confirmDelete}
              >
                Delete Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── FieldPalette ─────────────────────────────────────────────────────────────
const FieldPalette = ({ onAdd }) => (
  <div className={styles.palette}>
    <div className={styles.paletteHeader}>Form Elements</div>
    <div style={{ flex: 1, overflowY: "auto" }}>
      <PaletteSection label="Text Inputs">
        {["short", "para", "number", "email", "date"].map((t) => (
          <PaletteItem key={t} type={t} onAdd={onAdd} />
        ))}
      </PaletteSection>
      <PaletteSection label="Selections">
        {["dropdown", "radio", "checkbox"].map((t) => (
          <PaletteItem key={t} type={t} onAdd={onAdd} />
        ))}
      </PaletteSection>
      <PaletteSection label="Uploads">
        <PaletteItem type="file" onAdd={onAdd} />
      </PaletteSection>
    </div>
  </div>
);

const PaletteSection = ({ label, children }) => (
  <div className={styles.paletteSection}>
    <div className={styles.paletteLabel}>{label}</div>
    {children}
  </div>
);

const PaletteItem = ({ type, onAdd }) => {
  const { label, icon } = FIELD_TYPES[type];
  return (
    <div className={styles.paletteItem} onClick={() => onAdd(type)}>
      <span className={styles.paletteIcon}>{icon}</span>
      {label}
    </div>
  );
};

// ─── FieldCard ────────────────────────────────────────────────────────────────
const FieldCard = ({
  field,
  index,
  active,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
}) => (
  <div
    className={`${styles.fieldCard} ${active ? styles.activeFieldCard : ""}`}
    onClick={onSelect}
  >
    <div className={styles.fieldHeader}>
      <input
        className={styles.fieldLabelInput}
        value={field.label}
        placeholder={`Question ${index + 1}`}
        onChange={(e) => {
          e.stopPropagation();
          onUpdate({ label: e.target.value });
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* 🚀 Updated: Replaced dropdown with a static Type Badge */}
      <div className={styles.typeBadge}>
        <span className={styles.typeBadgeIcon}>
          {FIELD_TYPES[field.type].icon}
        </span>
        <span>{FIELD_TYPES[field.type].label}</span>
      </div>
    </div>

    <div className={styles.fieldBody}>
      <FieldPreview
        field={field}
        active={active}
        onUpdateOption={onUpdateOption}
        onAddOption={onAddOption}
        onRemoveOption={onRemoveOption}
      />
    </div>

    {active && (
      <div className={styles.fieldFooter} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.actionBtn}
          onClick={onDuplicate}
          title="Duplicate"
        >
          <i className="ri-file-copy-line"></i>
        </button>
        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          onClick={onDelete}
          title="Delete"
        >
          <i className="ri-delete-bin-line"></i>
        </button>
        <div
          style={{
            width: 1,
            height: 24,
            background: "#e2e8f0",
            margin: "0 8px",
          }}
        ></div>
        <label className={styles.toggleLabel}>
          <span>Required</span>
          <button
            className={`${styles.toggleSwitch} ${field.required ? styles.on : ""}`}
            onClick={() => onUpdate({ required: !field.required })}
          >
            <span className={styles.toggleDot} />
          </button>
        </label>
      </div>
    )}
  </div>
);

// ─── FieldPreview ─────────────────────────────────────────────────────────────
const FieldPreview = ({
  field,
  active,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
}) => {
  switch (field.type) {
    case "short":
      return (
        <input
          className={styles.previewInput}
          placeholder="Short answer text"
          disabled
        />
      );
    case "para":
      return (
        <textarea
          className={styles.previewInput}
          placeholder="Long answer text"
          rows={2}
          disabled
        />
      );
    case "number":
      return (
        <input
          className={styles.previewInput}
          placeholder="Numeric input"
          disabled
        />
      );
    case "email":
      return (
        <input
          className={styles.previewInput}
          placeholder="Email address"
          disabled
        />
      );
    case "date":
      return (
        <input
          className={styles.previewInput}
          placeholder="DD / MM / YYYY"
          disabled
        />
      );
    case "file":
      return (
        <div className={styles.fileZone}>
          <i
            className="ri-upload-cloud-2-line"
            style={{ fontSize: "1.4rem", marginRight: 8 }}
          ></i>{" "}
          File Upload Zone (PDF, JPG, PNG)
        </div>
      );
    case "dropdown":
      return (
        <>
          <select className={styles.previewInput} disabled>
            <option>Dropdown preview</option>
          </select>
          {active && (
            <OptionsEditor
              options={field.options}
              shape="number"
              onUpdate={onUpdateOption}
              onAdd={onAddOption}
              onRemove={onRemoveOption}
            />
          )}
        </>
      );
    case "radio":
      return (
        <OptionsEditor
          options={field.options}
          shape="circle"
          active={active}
          onUpdate={onUpdateOption}
          onAdd={onAddOption}
          onRemove={onRemoveOption}
        />
      );
    case "checkbox":
      return (
        <OptionsEditor
          options={field.options}
          shape="square"
          active={active}
          onUpdate={onUpdateOption}
          onAdd={onAddOption}
          onRemove={onRemoveOption}
        />
      );
    default:
      return null;
  }
};

// ─── OptionsEditor ────────────────────────────────────────────────────────────
const OptionsEditor = ({
  options,
  shape,
  active,
  onUpdate,
  onAdd,
  onRemove,
}) => (
  <div style={{ marginTop: 16 }}>
    {options.map((o, i) => (
      <div key={i} className={styles.optionRow}>
        {shape === "circle" && (
          <i
            className="ri-checkbox-blank-circle-line"
            style={{ color: "#cbd5e1" }}
          ></i>
        )}
        {shape === "square" && (
          <i
            className="ri-checkbox-blank-line"
            style={{ color: "#cbd5e1" }}
          ></i>
        )}
        {shape === "number" && (
          <span style={{ color: "#94a3b8", width: 20 }}>{i + 1}.</span>
        )}

        {active ? (
          <>
            <input
              className={styles.optionInput}
              value={o}
              onChange={(e) => {
                e.stopPropagation();
                onUpdate(i, e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {options.length > 1 && (
              <button
                className={styles.actionBtn}
                style={{ padding: 4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(i);
                }}
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </>
        ) : (
          <span style={{ color: "#64748b" }}>{o}</span>
        )}
      </div>
    ))}
    {active && (
      <button
        className={styles.addOptionBtn}
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
      >
        <i className="ri-add-line"></i> Add option
      </button>
    )}
  </div>
);

// ─── EmptyCanvas ──────────────────────────────────────────────────────────────
const EmptyCanvas = ({ onAdd }) => (
  <div className={styles.emptyState}>
    <i
      className="ri-file-list-3-line"
      style={{
        fontSize: "3rem",
        color: "#cbd5e1",
        marginBottom: 16,
        display: "block",
      }}
    ></i>
    <h3 style={{ color: "#0f172a", fontSize: "1.2rem", marginBottom: 8 }}>
      Form is empty
    </h3>
    <p className={styles.emptyText}>
      Start building your form by adding fields from the palette on the left.
    </p>
    <button className={styles.emptyBtn} onClick={() => onAdd("short")}>
      <i className="ri-add-line"></i> Add First Question
    </button>
  </div>
);

export default AdminApplication;
