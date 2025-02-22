export default function DropDown({
  label,
  options,
  selected,
  onChange,
}: {
  label?: string;
  options: any[];
  selected: any;
  onChange: any;
}) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      console.log(e.target.value)
      var value = e.target.value as any
      if(e.target.value === 'none') {
        value = undefined;
      }
      onChange(value);
    } else {
      
    }
  };

  if (options.length > 0 && (typeof options[0] === 'string' || typeof options[0] === 'number')) {
    options = options.map((option) => ({ value: option, name: option }));
  }

  return (
    <div>
      {label && (
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <select
        id="location"
        name="location"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        onChange={handleSelectChange}
        value={selected}
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value === undefined ? 'none' : option.value}
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}