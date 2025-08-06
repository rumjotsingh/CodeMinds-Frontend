"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createProblem, updateProblem } from "../redux/slices/problemSlice";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProblemForm({ initialValues, onClose }) {
  const dispatch = useDispatch();
  const isEdit = !!initialValues;

  // Normalize initialValues or start empty
  const init = initialValues
    ? {
        ...initialValues,
        tags: initialValues.tags?.join(", ") || "",
        constraints: (initialValues.constraints || []).join("\n"),
        hints: (initialValues.hints || []).join("\n"),
        editorial: initialValues.editorial || "",
        examples: initialValues.examples || [{ input: "", output: "", explanation: "" }],
        testcases: initialValues.testcases || [{ input: "", output: "", isHidden: false }],
        codeSnippets: initialValues.codeSnippets || { PYTHON: "" },
        referenceSolutions: initialValues.referenceSolutions || { PYTHON: "" },
      }
    : {
        title: "",
        description: "",
        difficulty: "EASY",
        tags: "",
        constraints: "",
        hints: "",
        editorial: "",
        examples: [{ input: "", output: "", explanation: "" }],
        testcases: [{ input: "", output: "", isHidden: false }],
        codeSnippets: { PYTHON: "" },
        referenceSolutions: { PYTHON: "" },
      };

  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});
  const [newlyAddedTestcaseIndex, setNewlyAddedTestcaseIndex] = useState(null);

  useEffect(() => {
    setForm(init);
  }, [initialValues]);

  useEffect(() => {
    if (newlyAddedTestcaseIndex !== null) {
      const checkbox = document.getElementById(`testcase-hidden-${newlyAddedTestcaseIndex}`);
      if (checkbox) checkbox.focus();
    }
  }, [newlyAddedTestcaseIndex]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  }

  // Examples handlers
  function updateExample(index, field, value) {
    const newExamples = [...form.examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setForm((f) => ({ ...f, examples: newExamples }));
  }
  function addExample() {
    setForm((f) => ({
      ...f,
      examples: [...f.examples, { input: "", output: "", explanation: "" }],
    }));
  }
  function removeExample(index) {
    if (form.examples.length === 1) return;
    setForm((f) => ({ ...f, examples: f.examples.filter((_, i) => i !== index) }));
  }

  // Testcases handlers
  function updateTestcase(index, field, value) {
    const newTestcases = [...form.testcases];
    if (field === "isHidden") {
      newTestcases[index][field] = !!value;
    } else {
      newTestcases[index][field] = value;
    }
    setForm((f) => ({ ...f, testcases: newTestcases }));
  }
  function addTestcase() {
    setForm((f) => ({
      ...f,
      testcases: [...f.testcases, { input: "", output: "", isHidden: false }],
    }));
    setNewlyAddedTestcaseIndex(form.testcases.length); // focus next render
  }
  function removeTestcase(index) {
    if (form.testcases.length === 1) return;
    setForm((f) => ({ ...f, testcases: f.testcases.filter((_, i) => i !== index) }));
    if (index === newlyAddedTestcaseIndex) setNewlyAddedTestcaseIndex(null);
  }

  // CodeSnippets handlers
  function updateCodeSnippet(lang, value) {
    setForm((f) => ({
      ...f,
      codeSnippets: { ...f.codeSnippets, [lang]: value },
    }));
  }

  // ReferenceSolutions handlers
  function updateReferenceSolution(lang, value) {
    setForm((f) => ({
      ...f,
      referenceSolutions: { ...f.referenceSolutions, [lang]: value },
    }));
  }

  // Basic simple validation
  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.tags.trim()) newErrors.tags = "Tags are required";
    if (!form.constraints.trim()) newErrors.constraints = "Constraints are required";
    if (!form.hints.trim()) newErrors.hints = "Hints are required";
    if (!form.editorial.trim()) newErrors.editorial = "Editorial is required";

    form.examples.forEach((ex, idx) => {
      if (!ex.input.trim() || !ex.output.trim()) {
        newErrors[`examples_${idx}`] = "Example input and output are required";
      }
    });

    form.testcases.forEach((tc, idx) => {
      if (!tc.input.trim() || !tc.output.trim()) {
        newErrors[`testcases_${idx}`] = "Testcase input and output are required";
      }
    });

    Object.entries(form.codeSnippets).forEach(([lang, val]) => {
      if (!val.trim()) {
        newErrors[`codeSnippets_${lang}`] = `Code snippet for ${lang} is required`;
      }
    });

    Object.entries(form.referenceSolutions).forEach(([lang, val]) => {
      if (!val.trim()) {
        newErrors[`referenceSolutions_${lang}`] = `Reference solution for ${lang} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const prob = {
      ...form,
      tags: form.tags.split(",").map((v) => v.trim()).filter(Boolean),
      constraints: form.constraints.split("\n").map((s) => s.trim()).filter(Boolean),
      hints: form.hints.split("\n").map((s) => s.trim()).filter(Boolean),
      examples: form.examples,
      testcases: form.testcases,
      codeSnippets: form.codeSnippets,
      referenceSolutions: form.referenceSolutions,
      editorial: form.editorial.trim(),
    };

    if (isEdit) {
      dispatch(updateProblem({ id: initialValues._id, updatedData: prob }));
    } else {
      dispatch(createProblem(prob));
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-8"
        noValidate
      >
        <h2 className="text-2xl font-semibold">{isEdit ? "Update" : "Create"} Problem</h2>

        {/* Title */}
        <div>
          <Label htmlFor="title" className="font-medium">Title</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            aria-invalid={errors.title ? "true" : "false"}
            required
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="font-medium">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            aria-invalid={errors.description ? "true" : "false"}
            required
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
        </div>

        {/* Difficulty */}
        <div>
          <Label htmlFor="difficulty" className="font-medium">Difficulty</Label>
          <select
            id="difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={errors.difficulty ? "true" : "false"}
            required
          >
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
          {errors.difficulty && <p className="text-sm text-red-600 mt-1">{errors.difficulty}</p>}
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags" className="font-medium">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            aria-invalid={errors.tags ? "true" : "false"}
            placeholder="Example: Array, Greedy, DP"
            required
          />
          {errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags}</p>}
        </div>

        {/* Constraints */}
        <div>
          <Label htmlFor="constraints" className="font-medium">Constraints (one per line)</Label>
          <Textarea
            id="constraints"
            name="constraints"
            value={form.constraints}
            onChange={handleChange}
            rows={2}
            aria-invalid={errors.constraints ? "true" : "false"}
            placeholder="- 2 &lt;= height.length &lt;= 10^5"
            required
          />
          {errors.constraints && <p className="text-sm text-red-600 mt-1">{errors.constraints}</p>}
        </div>

        {/* Hints */}
        <div>
          <Label htmlFor="hints" className="font-medium">Hints (one per line)</Label>
          <Textarea
            id="hints"
            name="hints"
            value={form.hints}
            onChange={handleChange}
            rows={2}
            aria-invalid={errors.hints ? "true" : "false"}
            placeholder="One per line"
            required
          />
          {errors.hints && <p className="text-sm text-red-600 mt-1">{errors.hints}</p>}
        </div>

        {/* Editorial */}
        <div>
          <Label htmlFor="editorial" className="font-medium">Editorial</Label>
          <Textarea
            id="editorial"
            name="editorial"
            value={form.editorial}
            onChange={handleChange}
            rows={4}
            aria-invalid={errors.editorial ? "true" : "false"}
            required
          />
          {errors.editorial && <p className="text-sm text-red-600 mt-1">{errors.editorial}</p>}
        </div>

        {/* Examples */}
        <div>
          <Label className="font-medium mb-2 block">Examples</Label>
          {form.examples.map((ex, idx) => (
            <div key={idx} className="mb-4 border border-gray-200 rounded p-4 relative">
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => removeExample(idx)}
                disabled={form.examples.length === 1}
                type="button"
              >
                Remove
              </Button>
              <div className="mb-2">
                <Label htmlFor={`example-input-${idx}`}>Input</Label>
                <Textarea
                  id={`example-input-${idx}`}
                  value={ex.input}
                  onChange={(e) => updateExample(idx, "input", e.target.value)}
                  rows={2}
                  required
                />
              </div>
              <div className="mb-2">
                <Label htmlFor={`example-output-${idx}`}>Output</Label>
                <Textarea
                  id={`example-output-${idx}`}
                  value={ex.output}
                  onChange={(e) => updateExample(idx, "output", e.target.value)}
                  rows={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`example-explanation-${idx}`}>Explanation (optional)</Label>
                <Textarea
                  id={`example-explanation-${idx}`}
                  value={ex.explanation}
                  onChange={(e) => updateExample(idx, "explanation", e.target.value)}
                  rows={2}
                />
              </div>
              {errors[`examples_${idx}`] && (
                <p className="text-sm text-red-600 mt-1">{errors[`examples_${idx}`]}</p>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addExample}>
            + Add Example
          </Button>
        </div>

        {/* Testcases */}
        <div>
          <Label className="font-medium mb-2 block">Testcases</Label>
          {form.testcases.map((tc, idx) => (
            <div key={idx} className="mb-4 border border-gray-200 rounded p-4 relative">
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => removeTestcase(idx)}
                disabled={form.testcases.length === 1}
                type="button"
              >
                Remove
              </Button>
              <div className="mb-2">
                <Label htmlFor={`testcase-input-${idx}`}>Input</Label>
                <Textarea
                  id={`testcase-input-${idx}`}
                  value={tc.input}
                  onChange={(e) => updateTestcase(idx, "input", e.target.value)}
                  rows={2}
                  required
                />
              </div>
              <div className="mb-2">
                <Label htmlFor={`testcase-output-${idx}`}>Output</Label>
                <Textarea
                  id={`testcase-output-${idx}`}
                  value={tc.output}
                  onChange={(e) => updateTestcase(idx, "output", e.target.value)}
                  rows={2}
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`testcase-hidden-${idx}`}
                  checked={tc.isHidden}
                  onChange={(e) => updateTestcase(idx, "isHidden", e.target.checked)}
                  required
                />
                <Label htmlFor={`testcase-hidden-${idx}`}>Hidden testcase</Label>
              </div>

              {errors[`testcases_${idx}`] && (
                <p className="text-sm text-red-600 mt-1">{errors[`testcases_${idx}`]}</p>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addTestcase}>
            + Add Testcase
          </Button>
        </div>

        {/* CodeSnippets */}
        <div>
          <Label className="font-medium mb-2 block">Code Snippets (per language)</Label>
          {Object.entries(form.codeSnippets).map(([lang, code]) => (
            <div key={lang} className="mb-4">
              <Label htmlFor={`codeSnippet-${lang}`} className="capitalize">{lang}</Label>
              <Textarea
                id={`codeSnippet-${lang}`}
                value={code}
                onChange={(e) => updateCodeSnippet(lang, e.target.value)}
                rows={4}
                required
              />
              {errors[`codeSnippets_${lang}`] && (
                <p className="text-sm text-red-600 mt-1">{errors[`codeSnippets_${lang}`]}</p>
              )}
            </div>
          ))}
          {/* Optionally add language addition feature */}
        </div>

        {/* ReferenceSolutions */}
        <div>
          <Label className="font-medium mb-2 block">Reference Solutions (per language)</Label>
          {Object.entries(form.referenceSolutions).map(([lang, code]) => (
            <div key={lang} className="mb-4">
              <Label htmlFor={`referenceSolution-${lang}`} className="capitalize">{lang}</Label>
              <Textarea
                id={`referenceSolution-${lang}`}
                value={code}
                onChange={(e) => updateReferenceSolution(lang, e.target.value)}
                rows={4}
                required
              />
              {errors[`referenceSolutions_${lang}`] && (
                <p className="text-sm text-red-600 mt-1">{errors[`referenceSolutions_${lang}`]}</p>
              )}
            </div>
          ))}
          {/* Optionally add language addition feature */}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
        </div>
      </form>
    </div>
  );
}
