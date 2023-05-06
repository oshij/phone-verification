import React, { useState, useEffect, useRef } from 'react';
import './PhoneVerificationPopup.css';

function PhoneVerificationPopup() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput].focus();
    }
  }, [activeInput]);

  function handleInputChange(e, index) {
    const { value } = e.target;

    // Only allow numeric values
    if (!/^[0-9]*$/gm.test(value)) return;

    const otpCopy = [...otp];
    otpCopy[index] = value;
    setOtp(otpCopy);

    if (value === '') {
      setActiveInput(index - 1);
    } else if (index < otp.length - 1) {
      setActiveInput(index + 1);
    }
  }

  function handleInputKeyDown(e, index) {
    if (e.key === 'ArrowLeft') {
      setActiveInput(index - 1 >= 0 ? index - 1 : 0);
    } else if (e.key === 'ArrowRight') {
      setActiveInput(index + 1 < otp.length ? index + 1 : otp.length - 1);
    } else if (e.key === 'Backspace' && !otp[index]) {
      setActiveInput(index - 1 >= 0 ? index - 1 : 0);
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      setActiveInput(index + 1 < otp.length ? index + 1 : otp.length - 1);
    }
  }

  function handlePaste(e) {
    const pasteData = e.clipboardData.getData('text/plain');
    const otpCopy = [...otp];

    pasteData.split('').forEach((value, index) => {
      if (/^[0-9]*$/gm.test(value) && index < otp.length) {
        otpCopy[index] = value;
      }
    });

    setOtp(otpCopy);
  }

  return (
    <div className="popup">
      <h2 id="oshij">Phone Verification</h2>
      <p>Please enter the 6 digit verification code sent to your phone</p>
      <div className="otp-input-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={ref => inputRefs.current[index] = ref}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => handleInputChange(e, index)}
            onKeyDown={e => handleInputKeyDown(e, index)}
            onPaste={handlePaste}
          />
        ))}
      </div>
      <button>Verify</button>
    </div>
  );
}

export default PhoneVerificationPopup;
