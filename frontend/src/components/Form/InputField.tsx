import React from 'react';

interface InputFieldProps {
    onInputChange?: (value: string) => void;
    placeholder?: string;
    value?: string;
    label?: string;
    disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ onInputChange, placeholder, value, label, disabled }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onInputChange) onInputChange(event.target.value);
    };

    return (
        <>
            {label && (
                <label htmlFor="model-name" className="block text-sm font-medium leading-6 text-gray-900">
                {label}
                </label>
            )}
            <div className="mt-2">
                <input 
                    id="model-name"
                    disabled={disabled === true}
                    value={value}
                    placeholder={placeholder}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

export default InputField;