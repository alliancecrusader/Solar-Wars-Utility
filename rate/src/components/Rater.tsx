import React, { useState } from "react";
import * as Types from "../modules/types";

type CalculatorProps = {
  rate_name: string;
  params: Types.param_type[];
  computeCost: (values: any) => Types.vehicle_cost;
  goBack?: () => void;
};

const cost_message_formatter = (cost: Types.vehicle_cost): string => {
    return `${cost.er} ER, ${cost.cm} CM, ${cost.cs} CS, ${cost.el} EL, ${cost.cs_upkeep} CS Upkeep`;
}

const DynamicCostCalculator: React.FC<CalculatorProps> = ({ rate_name, params, computeCost, goBack }) => {
  const [values, setValues] = useState<Record<string, any>>(
    Object.fromEntries(params.map((param) => [param.id, param.default || ""]))
  );
  const [result, setResult] = useState<Types.vehicle_cost | null>(null);

  const handleChange = (id: string, value: any) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setResult(computeCost(values));
  };

  return (
    <div className="container">
      <h1>{rate_name}</h1>
      {params.map((param) => (
        <div key={param.id} className="input-group">
          <label htmlFor={param.id}>{param.label}:</label>
          {param.type === "number" ? (
            <input
              type="number"
              id={param.id}
              value={values[param.id]}
              onChange={(e) => handleChange(param.id, parseFloat(e.target.value) || 0)}
            />
          ) : param.type === "text" ? (
            <input
              type="text"
              id={param.id}
              value={values[param.id]}
              onChange={(e) => handleChange(param.id, e.target.value)}
            />
          ) : (
            <select
              id={param.id}
              value={values[param.id]}
              onChange={(e) => handleChange(param.id, e.target.value)}
            >
              {param.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Calculate</button>
      {result !== null && (
        <div className="result">
            {cost_message_formatter(result)}
        </div>
      )}
      {goBack && (
        <button onClick={goBack} className="menu-button">Back to Menu</button>
      )}
    </div>
  );
};

export default DynamicCostCalculator;
