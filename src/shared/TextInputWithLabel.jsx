function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  inputRef,
  value,
}) {
  return (
    <>
      {/* Label connected to the input */}
      <label htmlFor={elementId}>{labelText}</label>

      {/* Reusable text input */}
<input
  type="text"
  id={elementId}
  name={elementId}
  ref={inputRef}
  value={value}
  onChange={onChange}
/>
    </>
  );
}

export default TextInputWithLabel;