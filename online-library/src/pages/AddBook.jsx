import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBook } from "../store/booksSlice.js";
import { categories } from "../data/books.js";

const empty = { title: "", author: "", category: "", rating: "", description: "" };

// Returns an object of error messages (empty object = valid)
function validate(f) {
  const e = {};
  if (f.title.trim().length < 2) e.title = "Title must be at least 2 characters.";
  if (!/^[A-Za-z .'-]{2,}$/.test(f.author.trim())) e.author = "Enter a valid author name (letters only, min 2 chars).";
  if (!f.category) e.category = "Please select a category.";
  const r = Number(f.rating);
  if (f.rating === "" || isNaN(r) || r < 0 || r > 5) e.rating = "Rating must be a number between 0 and 5.";
  if (f.description.trim().length < 20) e.description = "Description must be at least 20 characters.";
  return e;
}

export default function AddBook() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Generic change handler: updates the field named by the input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return; // stop if invalid

    // Save to Redux, then redirect to Browse Books
    dispatch(addBook({
      id: Date.now(),
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category,
      rating: Number(form.rating),
      description: form.description.trim(),
    }));
    navigate("/books");
  };

  // Small helper to render a labelled field with its error message
  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} className="input" value={form[name]} onChange={handleChange} {...props} />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </div>
  );

  return (
    <form className="panel form" onSubmit={handleSubmit} noValidate>
      <h1>Add a New Book</h1>
      {field("title", "Title")}
      {field("author", "Author")}

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" className="input" value={form.category} onChange={handleChange}>
          <option value="">-- Select --</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        {errors.category && <span className="error">{errors.category}</span>}
      </div>

      {field("rating", "Rating (0–5)", { type: "number", step: "0.1", min: 0, max: 5 })}

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="4" className="input" value={form.description} onChange={handleChange} />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <button className="btn" type="submit">Add Book</button>
    </form>
  );
}
