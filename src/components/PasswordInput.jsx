import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Password field with a button to show or hide what was typed
function PasswordInput({ id, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input">
      <input id={id} type={visible ? 'text' : 'password'} className="input" {...props} />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-controls={id}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

export default PasswordInput;
