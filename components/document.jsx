import React, { useState } from "react";
import { MathComponent } from "mathjax-react";
import "./doc.css";

const FormulaInput = ({ formula, variables, computeCallback }) => {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompute = () => {
    const computedValue = computeCallback(inputs);
    setResult(computedValue);
  };

  return (
    <div
      style={{
        marginTop: "-50px",
        padding: "20px",
        border: "2px solid rgba(0, 101, 252, 0.52)",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(to right,rgba(255, 255, 255, 0.98),rgba(233, 236, 239, 0.63))",
        width: "300px",
        marginBottom: "10px",
        position: "absolute"
      }}
    >
      <h3 style={{ textAlign: "center" }}>Input Values for {formula}</h3>
      {variables.map((variable) => (
        <div key={variable} style={{ marginBottom: "10px" }}>
          <label>
            <strong>{variable}:</strong>
            <input
              type="number"
              name={variable}
              onChange={handleInputChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </label>
        </div>
      ))}
      <button
        onClick={handleCompute}
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          background: "#bfbfc0",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Compute
      </button>
      {result !== null && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          <strong>Result: </strong>
          {result}
        </p>
      )}
    </div>
  );
};

const Document = () => {
  const [activeFormula, setActiveFormula] = useState(null);

  const formulas = [
    {
      name: "C_L",
      math: "C_L = a_{L1}\\alpha + a_{L0}",
      variables: ["aL1", "alpha", "aL0"],
      compute: (inputs) =>
        parseFloat(inputs.aL1) * parseFloat(inputs.alpha) +
        parseFloat(inputs.aL0),
    },
    {
      name: "C_D",
      math: "C_D = a_{D2}\\alpha^2 + a_{D1}\\alpha + a_{D0}",
      variables: ["aD2", "alpha", "aD1", "aD0"],
      compute: (inputs) =>
        parseFloat(inputs.aD2) * Math.pow(parseFloat(inputs.alpha), 2) +
        parseFloat(inputs.aD1) * parseFloat(inputs.alpha) +
        parseFloat(inputs.aD0),
    },
    {
      name: "F",
      math: "F = (b_{F1}\\alpha + b_{F0}) \\omega^2",
      variables: ["bF1", "alpha", "bF0", "omega"],
      compute: (inputs) =>
        (parseFloat(inputs.bF1) * parseFloat(inputs.alpha) +
          parseFloat(inputs.bF0)) *
        Math.pow(parseFloat(inputs.omega), 2),
    },
    {
      name: "Q",
      math: "Q = (b_{Q2}\\alpha^2 + b_{Q1}\\alpha + b_{Q0}) \\omega^2",
      variables: ["bQ2", "alpha", "bQ1", "bQ0", "omega"],
      compute: (inputs) =>
        (parseFloat(inputs.bQ2) * Math.pow(parseFloat(inputs.alpha), 2) +
          parseFloat(inputs.bQ1) * parseFloat(inputs.alpha) +
          parseFloat(inputs.bQ0)) *
        Math.pow(parseFloat(inputs.omega), 2),
    },
    {
      name: "Energy Input",
      math: "P = T\\omega = Q\\omega + B_\\omega \\omega^2 + (J \\omega \\frac{d\\omega}{dt} + T_C) \\omega",
      variables: ["T", "omega", "B_omega", "J", "d_omega_dt", "T_C"],
      compute: (inputs) =>
        parseFloat(inputs.T) * parseFloat(inputs.omega) +
        parseFloat(inputs.B_omega) * Math.pow(parseFloat(inputs.omega), 2) +
        (parseFloat(inputs.J) * parseFloat(inputs.omega) *
          parseFloat(inputs.d_omega_dt) +
          parseFloat(inputs.T_C)) *
          parseFloat(inputs.omega),
    },
    {
      name: "Alpha Opt",
      math: "\\alpha_{opt} = \\frac{-b_{Q2}b_{F0} + \\sqrt{(b_{Q2}b_{F0})^2 - b_{Q2}b_{F1}(-b_{F1}b_{Q0} + b_{Q1}b_{F0})}}{b_{Q2}b_{F1}}",
      variables: ["bQ2", "bF0", "bF1", "bQ1", "bQ0"],
      compute: (inputs) => {
        const discriminant =
          Math.pow(parseFloat(inputs.bQ2) * parseFloat(inputs.bF0), 2) -
          parseFloat(inputs.bQ2) *
            parseFloat(inputs.bF1) *
            (-parseFloat(inputs.bF1) * parseFloat(inputs.bQ0) +
              parseFloat(inputs.bQ1) * parseFloat(inputs.bF0));
        if (discriminant >= 0) {
          return (
            (-parseFloat(inputs.bQ2) * parseFloat(inputs.bF0) +
              Math.sqrt(discriminant)) /
            (parseFloat(inputs.bQ2) * parseFloat(inputs.bF1))
          );
        } else {
          return "Invalid: Discriminant < 0";
        }
      },
    },
  ];

  return (
    <>
      <h1 style={{display: "flex", justifyContent: "center", alignItems: "center", width: "90vw", marginLeft: "20px"}}>Modeling of Variable Pitch Propeller</h1>

      <div className="cntnr" style={{ padding: "20px", fontFamily: "Arial, sans-serif" , display: "flex"}}>
        
        <div className="left" style={{width: "48vw"}}>
          <ul>
            {formulas.map((formula, index) => (
              <li key={index}>
                <button
                  onClick={() =>
                    setActiveFormula((prev) =>
                      prev === formula.name ? null : formula.name
                    )
                  }
                  style={{
                    marginBottom: "10px",
                    padding: "8px 16px",
                    background: "#007BFF",
                    color: "#fff",
                    backgroundColor: "#979797",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Calculate <MathComponent tex={formula.name} display={false} />
                </button>
                <strong style={{ fontSize: "20px", fontWeight: "bold" }}>

                  <MathComponent tex={formula.math} />
                </strong>
                {activeFormula === formula.name && (
                  <FormulaInput
                    formula={formula.name}
                    variables={formula.variables}
                    computeCallback={formula.compute}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="right" style={{width: "48vw"}}>
          <h2>Variable's Descriptions</h2>
          <ul className="varList">
            {/* <li>
              <b className="bld"><MathComponent tex="dL" display={false} /></b>, <b className="bld"><MathComponent tex="dD" display={false} /></b>: Differential lift and drag forces.
            </li> */}
            <li>
              <b className="bld"><MathComponent tex="\rho" display={false} /></b>: Air density (constant).
            </li>
            <li>
              <b className="bld"><MathComponent tex="r" display={false} /></b>: Radial distance from the propeller center.
            </li>
            <li>
              <b className="bld"><MathComponent tex="\omega" display={false} /></b>: Rotational speed of the propeller.
            </li>
            <li>
              <b className="bld"><MathComponent tex="C" display={false} /></b>: Chord length of the blade element.
            </li>
            <li>
              <b className="bld"><MathComponent tex="C_L" display={false} /></b>, <b className="bld"><MathComponent tex="C_D" display={false} /></b>: Lift and drag coefficients, determined by the aerodynamic properties of the propeller.
            </li>
            <li>
              <b className="bld"><MathComponent tex="\alpha" display={false} /></b>: Pitch angle of the propeller blade.
            </li>
            <li>
              <b className="bld"><MathComponent tex="a_{L0}, a_{L1}, a_{D0}, a_{D1}, a_{D2}" display={false} /></b>: Aerodynamic coefficients for lift and drag polynomials.
            </li>
            <li>
              <b className="bld"><MathComponent tex="F" display={false} /></b>: Thrust force generated by the propeller.
            </li>
            <li>
              <b className="bld"><MathComponent tex="Q" display={false} /></b>: Counter-torque generated by the propeller.
            </li>
            <li>
              <b className="bld"><MathComponent tex="b_{F0}, b_{F1}, b_{Q0}, b_{Q1}, b_{Q2}" display={false} /></b>: Model coefficients for thrust and torque equations.
            </li>
            <li>
              <b className="bld"><MathComponent tex="P" display={false} /></b>: Power input to the propeller.
            </li>
            <li>
              <b className="bld"><MathComponent tex="T" display={false} /></b>: Motor torque.
            </li>
            <li>
              <b className="bld"><MathComponent tex="B_\omega" display={false} /></b>: Viscosity coefficient of the motor.
            </li>
            <li>
              <b className="bld"><MathComponent tex="J" display={false} /></b>: Moment of inertia of the motor-propeller system.
            </li>
            <li>
              <b className="bld"><MathComponent tex="T_C" display={false} /></b>: Coulomb friction torque.
            </li>
            <li>
              <b className="bld"><MathComponent tex="\alpha_{opt}" display={false} /></b>: Optimal pitch angle for efficiency.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Document;
