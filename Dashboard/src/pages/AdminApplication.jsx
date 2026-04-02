import React, { useState, useEffect } from "react";
import styles from "./Application.module.css";
import { toast } from "react-hot-toast";

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
          icon: "ri-file-line",
          color: "var(--first-color)",
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const openBuilder = (form) => {
    setActiveForm(form);
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
      toast.error("Error deleting form");
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
      toast.error("Error saving form");
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
              border: "2px dashed #c0d0e0",
              background: "transparent",
              boxShadow: "none",
            }}
          >
            <div className={styles.cardTop}>
              <div
                className={styles.iconBox}
                style={{ backgroundColor: "#8a9ab0" }}
              >
                <i className="ri-add-line"></i>
              </div>
              <div className={styles.cardText}>
                <h3 style={{ color: "#5a6a7a" }}>Create Custom Form</h3>
                <p>Add a new application</p>
              </div>
            </div>
            <button
              className={styles.fillBtn}
              style={{
                background: "#fff",
                color: "var(--first-color)",
                border: "1px solid var(--first-color)",
              }}
              onClick={() => {
                const newForm = {
                  id: Date.now(),
                  title: "Untitled Form",
                  icon: "ri-file-add-line",
                  color: "var(--first-color)",
                  fields: 0,
                  isNew: true,
                };
                setForms([...forms, newForm]);
                openBuilder(newForm);
              }}
            >
              <i className="ri-add-circle-line"></i> Add New Form
            </button>
          </div>

          {forms.map((form) => (
            <div
              key={form.id}
              className={styles.card}
              style={{ position: "relative" }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: "transparent",
                  border: "none",
                  color: "#c62828",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px",
                  zIndex: 2,
                }}
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
                  <h3 style={{ paddingRight: "24px" }}>{form.title}</h3>
                  <p>
                    {form.rawFields?.length > 0
                      ? `${form.rawFields.length} question${form.rawFields.length !== 1 ? "s" : ""} configured`
                      : "No questions yet — click to build"}
                  </p>
                </div>
              </div>
              <button
                className={styles.fillBtn}
                onClick={() => openBuilder(form)}
              >
                <i className="ri-tools-line"></i> Build Form
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* form builder modal */}
      {activeForm && (
        <div className={styles.modalOverlay} onClick={closeBuilder}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 860,
              width: "95vw",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className={styles.modalHeader}>
              <div
                className={styles.modalIcon}
                style={{ backgroundColor: activeForm.color }}
              >
                <i className={activeForm.icon}></i>
              </div>
              <div>
                <input
                  value={activeForm.title}
                  onChange={(e) =>
                    setActiveForm({ ...activeForm, title: e.target.value })
                  }
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                  }}
                />
                <p>Form Builder — Admin</p>
              </div>
              <button className={styles.closeBtn} onClick={closeBuilder}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flex: 1,
                overflow: "hidden",
                borderTop: "1px solid var(--border-color, #e0eaf4)",
              }}
            >
              <FieldPalette onAdd={addField} />

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "18px 22px",
                  background: "var(--body-color, #f4f6fb)",
                }}
              >
                <div style={canvasCardStyle}>
                  <div
                    style={{
                      height: 6,
                      background: "var(--first-color)",
                      borderRadius: "8px 8px 0 0",
                      margin: "-1px -1px 0",
                    }}
                  />
                  <div style={{ padding: "16px 18px" }}>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#8a9ab0",
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                        marginBottom: 6,
                      }}
                    >
                      Form description
                    </p>
                    <textarea
                      style={descStyle}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Instructions or context shown to students…"
                      rows={2}
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #d8e4f0",
                    borderRadius: "12px",
                    marginBottom: 14,
                    padding: 12,
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
                    Approval Workflow
                  </p>
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      marginBottom: 10,
                      borderRadius: 6,
                      border: "1px solid #c7d3e0",
                    }}
                  />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {filteredRoles.length === 0 ? (
                      <small style={{ color: "#777" }}>No roles found</small>
                    ) : (
                      filteredRoles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          style={{
                            border: "1px solid #c0d0e0",
                            background: workflow.includes(role)
                              ? "#e6f0ff"
                              : "#fff",
                            color: "#2e3a59",
                            borderRadius: 6,
                            padding: "6px 10px",
                            cursor: workflow.includes(role)
                              ? "not-allowed"
                              : "pointer",
                          }}
                          onClick={() => addRoleToWorkflow(role)}
                          disabled={workflow.includes(role)}
                        >
                          {role.replace(/_/g, " ")}
                        </button>
                      ))
                    )}
                  </div>
                  <div style={{ marginTop: 10, minHeight: 28 }}>
                    {workflow.length === 0 ? (
                      <small>No roles selected</small>
                    ) : (
                      workflow.map((role, idx) => (
                        <span
                          key={role}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            marginRight: 6,
                            background: "#f1f5ff",
                            border: "1px solid #ccd9f0",
                            borderRadius: 999,
                            padding: "4px 8px",
                            fontSize: 12,
                          }}
                        >
                          <span>{role.replace(/_/g, " ")}</span>
                          <button
                            type="button"
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "#a33",
                              cursor: "pointer",
                              padding: 0,
                            }}
                            onClick={() => removeRoleFromWorkflow(role)}
                          >
                            ❌
                          </button>
                          {idx < workflow.length - 1 && <span>→</span>}
                        </span>
                      ))
                    )}
                  </div>
                </div>

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
                        setActiveFieldId(f.id === activeFieldId ? null : f.id)
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

            <div className={styles.modalFooter}>
              <span
                style={{ fontSize: 12, color: "#8a9ab0", marginRight: "auto" }}
              >
                {fields.length} question{fields.length !== 1 ? "s" : ""}
              </span>
              <button className={styles.cancelBtn} onClick={() => saveForm()}>
                <i className="ri-save-line"></i> Save Form
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && <div style={toastStyle}>{toastMsg}</div>}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className={styles.modal}
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Delete Form</h3>
            </div>
            <div style={{ padding: "16px" }}>
              <p>
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.title}</strong>?
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className={styles.submitBtn}
                style={{ background: "#c62828" }}
                onClick={confirmDelete}
              >
                Delete
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
  <div style={paletteStyle}>
    <p style={paletteTitleStyle}>Add question</p>
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px 12px" }}>
      <PaletteSection label="Text">
        {["short", "para", "number", "email", "date"].map((t) => (
          <PaletteItem key={t} type={t} onAdd={onAdd} />
        ))}
      </PaletteSection>
      <PaletteSection label="Choice">
        {["dropdown", "radio", "checkbox"].map((t) => (
          <PaletteItem key={t} type={t} onAdd={onAdd} />
        ))}
      </PaletteSection>
      <PaletteSection label="Upload">
        <PaletteItem type="file" onAdd={onAdd} />
      </PaletteSection>
    </div>
  </div>
);

const PaletteSection = ({ label, children }) => (
  <>
    <p style={secLblStyle}>{label}</p>
    {children}
  </>
);

const PaletteItem = ({ type, onAdd }) => {
  const { label, icon } = FIELD_TYPES[type];
  return (
    <div
      style={paletteItemStyle}
      onClick={() => onAdd(type)}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#eef3ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
    >
      <span style={paletteIconStyle}>{icon}</span>
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
    style={{
      ...canvasCardStyle,
      borderLeft: active ? "4px solid var(--first-color)" : "1px solid #d8e4f0",
      boxShadow: active ? "0 2px 12px rgba(21,101,192,0.1)" : "none",
      cursor: "pointer",
      marginBottom: 10,
    }}
    onClick={onSelect}
  >
    <div style={{ padding: "14px 18px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <input
          style={fieldLblStyle}
          value={field.label}
          placeholder={`Question ${index + 1}`}
          onChange={(e) => {
            e.stopPropagation();
            onUpdate({ label: e.target.value });
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <div style={typePillStyle}>
          {FIELD_TYPES[field.type].icon} {FIELD_TYPES[field.type].label} ▾
          <select
            style={hiddenSelectStyle}
            value={field.type}
            onChange={(e) => {
              e.stopPropagation();
              onUpdate({ type: e.target.value });
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {Object.entries(FIELD_TYPES).map(([v, { label }]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <FieldPreview
        field={field}
        active={active}
        onUpdateOption={onUpdateOption}
        onAddOption={onAddOption}
        onRemoveOption={onRemoveOption}
      />
    </div>

    {active && (
      <div style={fcFootStyle} onClick={(e) => e.stopPropagation()}>
        <button style={factStyle} onClick={onDuplicate}>
          ⧉ Duplicate
        </button>
        <span style={sepStyle} />
        <button style={{ ...factStyle, color: "#c62828" }} onClick={onDelete}>
          🗑 Delete
        </button>
        <span style={sepStyle} />
        <label style={reqLblStyle}>
          Required
          <button
            style={{
              ...togStyle,
              background: field.required ? "var(--first-color)" : "#c0d0e0",
            }}
            onClick={() => onUpdate({ required: !field.required })}
          >
            <span
              style={{
                ...togDotStyle,
                transform: field.required ? "translateX(14px)" : "none",
              }}
            />
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
        <input style={previewInputStyle} placeholder="Short answer" disabled />
      );
    case "para":
      return (
        <textarea
          style={previewInputStyle}
          placeholder="Long answer"
          rows={2}
          disabled
        />
      );
    case "number":
      return <input style={previewInputStyle} placeholder="Number" disabled />;
    case "email":
      return (
        <input
          style={previewInputStyle}
          placeholder="email@example.com"
          disabled
        />
      );
    case "date":
      return (
        <input
          style={previewInputStyle}
          placeholder="DD / MM / YYYY"
          disabled
        />
      );
    case "file":
      return (
        <div style={fileZoneStyle}>
          📎 Students upload a file here · PDF, JPG, PNG — max 10 MB
        </div>
      );
    case "dropdown":
      return (
        <>
          <select style={previewInputStyle} disabled>
            <option>Choose an option</option>
            {field.options.map((o, i) => (
              <option key={i}>{o}</option>
            ))}
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
  <div style={{ marginTop: 6 }}>
    {options.map((o, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        {shape === "circle" && (
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              border: "1.5px solid #b0c0d0",
              flexShrink: 0,
            }}
          />
        )}
        {shape === "square" && (
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: 3,
              border: "1.5px solid #b0c0d0",
              flexShrink: 0,
            }}
          />
        )}
        {shape === "number" && (
          <span style={{ fontSize: 11, color: "#aab8c8", minWidth: 16 }}>
            {i + 1}.
          </span>
        )}
        {active ? (
          <>
            <input
              style={optInputStyle}
              value={o}
              onChange={(e) => {
                e.stopPropagation();
                onUpdate(i, e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {options.length > 1 && (
              <button
                style={optRemoveStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(i);
                }}
              >
                ×
              </button>
            )}
          </>
        ) : (
          <span style={{ fontSize: 13, color: "#8a9ab0" }}>{o}</span>
        )}
      </div>
    ))}
    {active && (
      <button
        style={addOptStyle}
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
      >
        + Add option
      </button>
    )}
  </div>
);

// ─── EmptyCanvas ──────────────────────────────────────────────────────────────
const EmptyCanvas = ({ onAdd }) => (
  <div style={emptyStyle}>
    <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
    <p style={{ marginBottom: 14, color: "#8a9ab0" }}>
      Click a field type on the left to add your first question
    </p>
    <button style={addFirstBtnStyle} onClick={() => onAdd("short")}>
      + Add first question
    </button>
  </div>
);

// ─── Inline Styles ────────────────────────────────────────────────────────────
const canvasCardStyle = {
  background: "#fff",
  border: "1px solid #d8e4f0",
  borderRadius: 12,
  overflow: "hidden",
  marginBottom: 10,
};
const descStyle = {
  width: "100%",
  border: "none",
  outline: "none",
  borderBottom: "1.5px solid #d8e4f0",
  fontSize: 13,
  color: "#5a6a7a",
  background: "transparent",
  resize: "none",
  fontFamily: "inherit",
  paddingBottom: 3,
};
const paletteStyle = {
  width: 200,
  background: "#fff",
  borderRight: "1px solid #d8e4f0",
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
};
const paletteTitleStyle = {
  fontSize: 10,
  fontWeight: 700,
  color: "#8a9ab0",
  textTransform: "uppercase",
  letterSpacing: ".6px",
  padding: "12px 14px 8px",
  borderBottom: "1px solid #d8e4f0",
};
const secLblStyle = {
  fontSize: 10,
  fontWeight: 700,
  color: "#aab8c8",
  textTransform: "uppercase",
  letterSpacing: ".5px",
  padding: "10px 4px 5px",
};
const paletteItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 8px",
  borderRadius: 8,
  border: "1px solid #e0eaf4",
  background: "#fff",
  cursor: "pointer",
  marginBottom: 5,
  transition: "all .15s",
  color: "#5a6a7a",
  fontSize: 13,
};
const paletteIconStyle = {
  width: 24,
  height: 24,
  borderRadius: 6,
  background: "#f4f7fb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  flexShrink: 0,
};
const fieldLblStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 14,
  fontWeight: 600,
  color: "#1a2e4a",
  background: "transparent",
  borderBottom: "1.5px solid #d8e4f0",
  padding: "3px 0",
  fontFamily: "inherit",
};
const typePillStyle = {
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: "5px 9px",
  border: "1px solid #d0dcea",
  borderRadius: 7,
  background: "#f4f7fb",
  fontSize: 11.5,
  color: "#5a6a7a",
  whiteSpace: "nowrap",
  flexShrink: 0,
  position: "relative",
  cursor: "pointer",
};
const hiddenSelectStyle = {
  position: "absolute",
  inset: 0,
  opacity: 0,
  cursor: "pointer",
  width: "100%",
};
const previewInputStyle = {
  width: "100%",
  padding: "6px 0",
  border: "none",
  borderBottom: "1.5px solid #d8e4f0",
  fontSize: 13,
  color: "#8a9ab0",
  background: "transparent",
  fontFamily: "inherit",
};
const fileZoneStyle = {
  border: "1.5px dashed #c0d0e0",
  borderRadius: 8,
  padding: "16px",
  textAlign: "center",
  color: "#8a9ab0",
  fontSize: 12.5,
  marginTop: 3,
  background: "#f8fafd",
};
const fcFootStyle = {
  padding: "8px 18px",
  borderTop: "1px solid #e8f0f8",
  display: "flex",
  alignItems: "center",
  gap: 10,
  justifyContent: "flex-end",
  background: "#f8fafd",
};
const sepStyle = { width: 1, height: 13, background: "#d8e4f0" };
const factStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "3px 8px",
  borderRadius: 6,
  fontSize: 12,
  fontFamily: "inherit",
  color: "#5a6a7a",
};
const reqLblStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  fontSize: 12,
  color: "#5a6a7a",
  cursor: "pointer",
  userSelect: "none",
};
const togStyle = {
  width: 30,
  height: 16,
  borderRadius: 12,
  position: "relative",
  transition: "background .2s",
  cursor: "pointer",
  border: "none",
  flexShrink: 0,
};
const togDotStyle = {
  position: "absolute",
  top: 2,
  left: 2,
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: "#fff",
  transition: "transform .2s",
  display: "block",
};
const optInputStyle = {
  flex: 1,
  border: "none",
  borderBottom: "1px solid #e0eaf4",
  outline: "none",
  fontSize: 13,
  color: "#5a6a7a",
  background: "transparent",
  padding: "2px 0",
  fontFamily: "inherit",
};
const optRemoveStyle = {
  background: "none",
  border: "none",
  color: "#aab8c8",
  cursor: "pointer",
  fontSize: 13,
  lineHeight: 1,
};
const addOptStyle = {
  background: "none",
  border: "none",
  fontSize: 12,
  color: "var(--first-color)",
  cursor: "pointer",
  padding: "2px 0",
  fontFamily: "inherit",
  margin: 1,
};
const emptyStyle = {
  border: "2px dashed #d0dcea",
  borderRadius: 12,
  padding: "48px 20px",
  textAlign: "center",
  background: "#fff",
};
const addFirstBtnStyle = {
  padding: "8px 18px",
  borderRadius: 8,
  border: "none",
  background: "var(--first-color)",
  color: "#fff",
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
};
const toastStyle = {
  position: "fixed",
  bottom: 18,
  right: 18,
  padding: "9px 16px",
  borderRadius: 8,
  background: "#1a2e4a",
  color: "#fff",
  fontSize: 12.5,
  zIndex: 9999,
};

export default AdminApplication;
