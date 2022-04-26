import { TextField } from "@mui/material";
import React, { useState } from "react";

const FormField = (props) => {
  const [value, setValue] = useState(props.value);
  const [t, setT] = useState(undefined);
  const onChange = (e) => {
    e.persist();
    setValue(e.target.value);
    if (t) clearTimeout(t);
    setT(
      setTimeout(() => {
        props.handleChange(e);
      }, 500)
    );
  };
  return (
    <TextField
      className={props.className || ""}
      id={props.field}
      type={props.type || "string"}
      label={props.label}
      value={value}
      error={!!props.error && props.touched}
      helperText={props.error && props.touched ? props.error : null}
      onChange={onChange}
      multiline={props.multiline}
    />
  );
};

export default React.memo(FormField);
