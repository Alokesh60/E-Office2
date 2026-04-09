import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Application.module.css";
import toast from "react-hot-toast";

const FormFill = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldName, value, fieldType) => {
    if (fieldType === "checkbox") {
      const currentValues = answers[fieldName] || [];
      if (currentValues.includes(value)) {
        setAnswers({
          ...answers,
          [fieldName]: currentValues.filter((v) => v !== value),
        });
      } else {
        setAnswers({
          ...answers,
          [fieldName]: [...currentValues, value],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [fieldName]: value,
      });
    }
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    form.fields.forEach((field) => {
      if (field.required) {
        const value = answers[field.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Answers: ", answers);

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("form_id", id);

      form.fields.forEach((field) => {
        const value = answers[field.id];

        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`field_${field.id}[]`, v));
        } else if (value instanceof File) {
          formData.append(`field_${field.id}`, value);
        } else {
          formData.append(`field_${field.id}`, value);
        }
      });

      // Object.entries(answers).forEach(([key, value]) => {
      //   if (Array.isArray(value)) {
      //     value.forEach((v) => formData.append(`field_${key}[]`, v));
      //   } else if (value instanceof File) {
      //     formData.append(`field_${key}`, value);
      //   } else {
      //     formData.append(`field_${key}`, value);
      //   }
      // });

      const res = await fetch(
        `http://localhost:8000/api/form/${form.id}/submit`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (res.ok) {
        toast.success("Form submitted successfully!");
        setAnswers({});
      } else {
        toast.error("Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/form/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!form) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.panel}>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  const renderField = (field) => {
    const value = answers[field.id] || "";
    const error = errors[field.id];

    switch (field.field_type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            required={field.required}
          />
        );
      case "email":
        return (
          <input
            type="email"
            value={value}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            required={field.required}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            required={field.required}
          />
        );
      case "textarea":
        return (
          <textarea
            value={value}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`${styles.textarea} ${error ? styles.inputError : ""}`}
            required={field.required}
            rows={4}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            required={field.required}
          />
        );
      case "dropdown":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`${styles.select} ${error ? styles.inputError : ""}`}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className={styles.radioGroup}>
            {field.options.map((opt, i) => (
              <label key={i} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
                <span className={styles.radioText}>{opt}</span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className={styles.checkboxGroup}>
            {field.options.map((opt, i) => (
              <label key={i} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={(value || []).includes(opt)}
                  onChange={() => handleInputChange(field.id, opt, "checkbox")}
                />
                <span className={styles.checkboxText}>{opt}</span>
              </label>
            ))}
          </div>
        );
      case "file":
        return (
          <input
            type="file"
            onChange={(e) => handleInputChange(field.id, e.target.files[0])}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            required={field.required}
            accept="image/*,.pdf,.doc,.docx"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <div className={styles.formCard}>
          <h2 className={styles.heading}>{form.name}</h2>
          {form.description && (
            <p className={styles.description}>{form.description}</p>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {form.fields.map((field) => (
              <div key={field.id} className={styles.fieldGroup}>
                <label className={styles.label}>
                  {field.label}
                  {field.required && <span className={styles.required}>*</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && (
                  <span className={styles.error}>{errors[field.id]}</span>
                )}
              </div>
            ))}

            <button
              type="submit"
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormFill;
