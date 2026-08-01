// ─────────────────────────────────────────
// ATLAS KTU — RAG Data Vault
// File: src/data/subjectData.js
// ─────────────────────────────────────────

export const subjectDetails = {

  // ==========================================
  // 2024 SCHEME — S1 SUBJECTS
  // ==========================================

  "GAMAT101 - Mathematics for Information Science 1": {
    scheme: "2024",
    semester: "S1",
    isNumerical: true,
    formulas: [
      "∇f = (∂f/∂x)i + (∂f/∂y)j (Gradient)",
      "D²= rt - s² where r=fxx, s=fxy, t=fyy (Second derivative test)",
      "Directional derivative = ∇f · u (unit vector)",
      "Lagrange: ∇f = λ∇g",
      "Steepest Descent: x(k+1) = x(k) - α∇f(x(k))",
      "LPP: Maximise/Minimise z = cx subject to Ax ≤ b, x ≥ 0"
    ],
    syllabus: "Module 1: Limits, Continuity, Derivatives, Linearization. Module 2: Functions of Several Variables, Partial/Mixed Derivatives, Chain Rule. Module 3: Directional Derivatives, Gradient, Local/Absolute Maxima/Minima, Saddle Points. Module 4: Constrained Optimization, Lagrange Multipliers, Method of Steepest Descent, Linear Programming Problems (LPP) Graphical Solution.",
    pyq: "Module 4 is highly predictable: expect guaranteed questions on solving LPP graphically, and heavy computation questions on the Method of Steepest Descent. Lagrange Multipliers are also heavily tested. In Module 3, expect local extrema/saddle points and Directional Derivatives.",
    exactPyqs: {
      partA_3Marks: [
        { q: "At what points are the function g(x) = (x²-x-6)/(x-3) for x≠3 and 5 for x=3 continuous?", marks: 3, module: 1, freq: 2 },
        { q: "Find the first and second derivatives of (x³+7)/x.", marks: 3, module: 1, freq: 3 },
        { q: "Find the limit of (1-cos(xy))/xy as (x,y) approaches (0,0).", marks: 3, module: 2, freq: 2 },
        { q: "Show that w_xy = w_yx where w = eˣ + x ln y + y ln x.", marks: 3, module: 2, freq: 3 },
        { q: "What are the directions of zero change in f(x,y) = x²/2 + y²/2 at (1,1)?", marks: 3, module: 3, freq: 2 },
        { q: "Find the critical points of the function f(x,y) = 5xy - 7x² + 3x - 6y + 2.", marks: 3, module: 3, freq: 4 },
        { q: "Find the extreme points of f(x,y) = x subject to the constraints x+y=16.", marks: 3, module: 4, freq: 3 },
        { q: "Solve the following LPP graphically: Maximise z=3x+2y subject to x+2y≤10, 3x+y≤15 and x,y≥0.", marks: 3, module: 4, freq: 4 },
        { q: "Evaluate lim x→1 (x-1)/(√(x+3)-2).", marks: 3, module: 1, freq: 2 },
        { q: "Find the derivative of the function f(x) = (ln x)/x³ at x=1.", marks: 3, module: 1, freq: 2 },
        { q: "Find the domain and range of the function f(x,y) = 1/√(16-x²-y²).", marks: 3, module: 2, freq: 2 },
        { q: "Verify ∂²u/∂x∂y = ∂²u/∂y∂x for u = tan⁻¹(x/y).", marks: 3, module: 2, freq: 3 },
        { q: "Prove that ∇(fg) = f∇g + g∇f.", marks: 3, module: 3, freq: 2 },
        { q: "Find the critical points of the function f(x,y) = x³ + 3xy + y³.", marks: 3, module: 3, freq: 3 },
        { q: "Find the maximum and minimum values of the function f(x,y) = 3x+4y on the circle x²+y²=1.", marks: 3, module: 4, freq: 3 },
        { q: "Form the LPP: DC Drug company produces two types of liquid pain killer N and S with profit $11 and $15 respectively. Formulate the LPP to maximise profit.", marks: 3, module: 4, freq: 2 }
      ],
      partB_Detailed: [
        { q: "Show that y = |x| is differentiable on (-∞,0) and (0,∞) but has no derivative at x=0.", marks: 6, module: 1, freq: 2 },
        { q: "Find the linearization of f(x) = cos x at x = π/2.", marks: 3, module: 1, freq: 3 },
        { q: "Determine the concavity of f(x) = x³ - 6x² + 9x + 1.", marks: 3, module: 1, freq: 2 },
        { q: "Find the first and second derivatives of y = (x+1)(x²+x+1)/x³.", marks: 4, module: 1, freq: 2 },
        { q: "Show that the point (2,4) lies on the curve x³+y³-9xy=0. Then find the tangent and normal to the curve there.", marks: 5, module: 1, freq: 3 },
        { q: "Determine the concavity of f(x) = x³-3x²+2 and find the points of inflexion.", marks: 4, module: 1, freq: 2 },
        { q: "If w = e^(x²y), x = √(uv), y = 1/v, find ∂w/∂u and ∂w/∂v at (2,2) using chain rule.", marks: 6, module: 2, freq: 4 },
        { q: "Find ∂²w/∂y∂x if w = xy + eʸ/(y²+1).", marks: 3, module: 2, freq: 2 },
        { q: "Find lim(x,y)→(0,0) (x²-xy)/(√x - √y).", marks: 3, module: 2, freq: 2 },
        { q: "If f(x,y) = x cos y + y eˣ find all four second order partial derivatives.", marks: 5, module: 2, freq: 3 },
        { q: "Show that f(x,y) = xy³/(x²+y⁶) has no limit as (x,y)→(0,0).", marks: 4, module: 2, freq: 2 },
        { q: "Express ∂w/∂r and ∂w/∂θ in terms of r and θ, where w = 4eˣ ln y, x = ln(r cos θ), y = r sin θ.", marks: 5, module: 2, freq: 3 },
        { q: "Find the local extrema of f(x,y) = 10xy·e^(-(x²+y²)).", marks: 6, module: 3, freq: 4 },
        { q: "Find the directional derivative at (1,-1) of g(x,y) = (x-y)/(xy+2) in the direction of v = 12i + 5j.", marks: 4, module: 3, freq: 3 },
        { q: "If w = f(x-y, y-z, z-x), show that ∂w/∂x + ∂w/∂y + ∂w/∂z = 0.", marks: 5, module: 3, freq: 2 },
        { q: "Locate the relative extrema and saddle point of f(x,y) = x³+3xy²-15x²-15y²+72x.", marks: 5, module: 3, freq: 4 },
        { q: "Find the absolute maximum and minimum of f(x,y) = 2x²-4x+y²-4y+1 on the closed triangular plane bounded by x=0, y=2, y=2x.", marks: 4, module: 3, freq: 3 },
        { q: "Minimise f(x,y) = x²+y² starting from (1,1) with step size α=0.1 using steepest descent for 2 iterations.", marks: 3, module: 4, freq: 4 },
        { q: "Find the largest and smallest values of f(x,y) = xy on the ellipse x²/8 + y²/2 = 1 using Lagrange multipliers.", marks: 5, module: 4, freq: 4 },
        { q: "Solve LPP graphically: Maximise z = 6x₁+11x₂ subject to 2x₁+x₂≤104, x₁+2x₂≤76, x₁,x₂≥0.", marks: 4, module: 4, freq: 3 },
        { q: "Find the point P(x,y,z) on the plane 2x+y-z-5=0 closest to the origin.", marks: 6, module: 4, freq: 3 },
        { q: "Solve LPP graphically: Minimise z=20x+10y subject to x+2y≤40, 3x+y≥30, 4x+3y≥60, x,y≥0.", marks: 5, module: 4, freq: 3 },
        { q: "Find extreme values of f(x,y,z)=x²+y²+z² subject to x+y+z=1 and x-y=0.", marks: 4, module: 4, freq: 2 },
        { q: "Minimise f(x,y) = 3x²+4y² from (1,1) using steepest descent with α=0.01 for 3 steps.", marks: 5, module: 4, freq: 3 }
      ]
    }
  },

  "GYMAT101 - Mathematics for Electrical Science and Physical Science - 1": {
    scheme: "2024",
    semester: "S1",
    isNumerical: true,
    formulas: [
      "Rank: Row reduce to echelon form, count non-zero rows",
      "Eigenvalue: det(A - λI) = 0",
      "Variation of Parameters: y = y_h + y_p where y_p = -y₁∫(y₂g/W)dx + y₂∫(y₁g/W)dx",
      "L{eᵃᵗ} = 1/(s-a)",
      "L{tⁿ} = n!/s^(n+1)",
      "L{sin at} = a/(s²+a²)",
      "Fourier: a₀ = (1/π)∫f(x)dx, aₙ = (1/π)∫f(x)cos(nx)dx, bₙ = (1/π)∫f(x)sin(nx)dx"
    ],
    syllabus: "Module 1: Matrix Theory, Systems of linear equations, Gauss elimination, Rank, Eigen values & vectors, Diagonalization, Orthogonal transformation. Module 2: Ordinary Differential Equations (ODEs) of second order, Homogeneous & non-homogeneous, Variation of parameters, Method of undetermined coefficients. Module 3: Laplace Transforms, Properties, Inverse Laplace Transforms, Convolution Theorem, Solving ODEs using Laplace. Module 4: Fourier Series, Dirichlet's conditions, Euler's formulas, Half-range expansions, Harmonic analysis.",
    pyq: "Module 1 guarantees 9-mark questions on Diagonalization or Orthogonal transformation. Module 2 heavily tests Variation of Parameters (9 marks). Module 3 guarantees solving Initial Value Problems using Laplace Transforms. Module 4 frequently features Fourier expansions.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Find the rank of the matrix [[2,1,-1],[0,3,-2],[2,4,-3]].", marks: 3, module: 1, freq: 3 },
        { q: "Find the eigenvalues and eigenvectors of [[1,2],[0,3]].", marks: 3, module: 1, freq: 4 },
        { q: "Show that y₁=e^(-2x) and y₂=e^(3x) are linearly independent.", marks: 3, module: 2, freq: 2 },
        { q: "Solve: y'' + 3y = 0.", marks: 3, module: 2, freq: 3 },
        { q: "Find L[e^(2t) + 4t³ - 2sin(3t)].", marks: 3, module: 3, freq: 4 },
        { q: "Find L⁻¹[(s²-3s+4)/s³].", marks: 3, module: 3, freq: 3 },
        { q: "Find the Fourier series coefficient a₀ for f(x) = x² in (-π,π).", marks: 3, module: 4, freq: 3 },
        { q: "Find the rank of [[1,2,6,7],[2,3,-1,6],[3,5,5,13]].", marks: 3, module: 1, freq: 2 },
        { q: "Find the eigenvalues of [[1,6,-2],[0,2,1],[0,0,3]].", marks: 3, module: 1, freq: 3 },
        { q: "Find the Wronskian of y₁=eˣ and y₂=e^(2x).", marks: 3, module: 2, freq: 2 },
        { q: "Solve y'' - 5y' + 6y = 0.", marks: 3, module: 2, freq: 3 },
        { q: "Find the Laplace transform of t·e^(-2t)·sin(3t).", marks: 3, module: 3, freq: 3 },
        { q: "Find L⁻¹[1/(s²+4s+13)].", marks: 3, module: 3, freq: 2 },
        { q: "Find the Fourier series of f(x) = x in (-π,π).", marks: 3, module: 4, freq: 4 }
      ],
      partB_Detailed: [
        { q: "Find the value of μ for which x+y+z=1, x+2y+3z=μ, x+5y+9z=μ² is consistent. Find solutions for each μ.", marks: 9, module: 1, freq: 3 },
        { q: "Diagonalize the matrix [[1,0,1],[0,3,2],[0,0,2]].", marks: 9, module: 1, freq: 4 },
        { q: "Find eigenvalues and eigenvectors of [[2,0,1],[0,2,0],[1,0,2]].", marks: 9, module: 1, freq: 3 },
        { q: "Reduce the quadratic form 2x²+2y²+2z²+2xz to canonical form by orthogonal transformation.", marks: 9, module: 1, freq: 4 },
        { q: "Solve using variation of parameters: y'' - y = x².", marks: 9, module: 2, freq: 4 },
        { q: "Solve: y'' + 4y = 0, y(0)=4, y'(0)=2.", marks: 5, module: 2, freq: 3 },
        { q: "Using undetermined coefficients, solve y'' + 3y' + 2y = 12x².", marks: 4, module: 2, freq: 3 },
        { q: "Solve y'' + 4y = sin(2x) using variation of parameters.", marks: 9, module: 2, freq: 4 },
        { q: "Using Laplace transforms, solve y'' + 5y' + 6y = 0, y(0)=0, y'(0)=-1.", marks: 5, module: 3, freq: 4 },
        { q: "Find L⁻¹[(2s+3)/(s²+13)].", marks: 4, module: 3, freq: 3 },
        { q: "Find L⁻¹[(2s-1)/((s-2)²+9)].", marks: 5, module: 3, freq: 3 },
        { q: "Find the Laplace transform of t·e^(-t)·sin(3t).", marks: 9, module: 3, freq: 3 },
        { q: "Find the Fourier series of f(x) = x² in (-π,π).", marks: 9, module: 4, freq: 4 }
      ]
    }
  },

  "GAPHT121 - Physics for Information Science": {
    scheme: "2024",
    semester: "S1",
    isNumerical: true,
    formulas: [
      "σ = ne²τ/m (Electrical conductivity)",
      "Hc(T) = H₀[1-(T/Tc)²] (Critical field vs temperature)",
      "ΔxΔp ≥ h/4π (Heisenberg uncertainty)",
      "E = hν = hc/λ (Photon energy)",
      "Eₙ = n²h²/8mL² (Particle in a box energy)",
      "NA = √(n₁²-n₂²) (Numerical aperture)",
      "I = I₀[e^(eV/kT) - 1] (Diode equation)",
      "η = P_dc/P_ac × 100% (Rectifier efficiency)"
    ],
    syllabus: "Module 1: Classical Free Electron Theory, Superconductivity (Type I & II, BCS Theory). Module 2: Quantum Mechanics, Wavefunction, Schrodinger Equation, Particle in a box, Tunnelling. Module 3: Semiconductor Physics, Intrinsic/Extrinsic, Fermi Level, p-n junction. Module 4: Optoelectronic Devices & Circuits (Solar cell, LED, PIN photodiode, Rectifiers).",
    pyq: "Heavily derivation oriented. Expect a 9-mark derivation on full-wave rectifiers or Schrodinger's wave equation. Part A frequently asks for definitions like critical field or Zener breakdown.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Write any three important postulates of classical free electron theory.", marks: 3, module: 1, freq: 3 },
        { q: "What is meant by critical field in superconductors? Explain the variation of critical field with temperature.", marks: 3, module: 1, freq: 4 },
        { q: "Explain natural broadening of spectral lines using Heisenberg's uncertainty principle.", marks: 3, module: 2, freq: 3 },
        { q: "Explain the phenomena of quantum mechanical tunnelling.", marks: 3, module: 2, freq: 3 },
        { q: "What are extrinsic semiconductors? How are they formed?", marks: 3, module: 3, freq: 3 },
        { q: "What is biasing? Explain the effects of forward biasing in a diode.", marks: 3, module: 3, freq: 3 },
        { q: "Explain the process of Zener breakdown in diodes.", marks: 3, module: 3, freq: 4 },
        { q: "How is light produced in an LED? Give two advantages of LEDs over conventional lamps.", marks: 3, module: 4, freq: 3 },
        { q: "Draw labelled energy band diagram of conductors, semiconductors and insulators.", marks: 3, module: 3, freq: 3 },
        { q: "Explain critical temperature and critical field and how they are related.", marks: 3, module: 1, freq: 3 },
        { q: "Explain with a numerical example that wave nature of matter is not apparent in daily observations.", marks: 3, module: 2, freq: 2 },
        { q: "Draw the V-I characteristics of a p-n junction diode and explain the features.", marks: 3, module: 3, freq: 4 },
        { q: "Explain the working of a tunnel diode.", marks: 3, module: 3, freq: 2 },
        { q: "Explain the working of LED.", marks: 3, module: 4, freq: 4 }
      ],
      partB_Detailed: [
        { q: "Obtain expressions for current density and electrical conductivity of a metallic conductor in terms of free electron concentration.", marks: 6, module: 1, freq: 4 },
        { q: "In a metal, find the probability of occupation of an energy level 0.01eV above Fermi level at 300K.", marks: 3, module: 1, freq: 3 },
        { q: "Compare Type I and Type II superconductors with proper figures. Write two examples for each.", marks: 6, module: 1, freq: 4 },
        { q: "Write six applications of superconductors in various fields.", marks: 3, module: 1, freq: 3 },
        { q: "What are the basic assumptions of classical free electron theory? Obtain expressions for drift velocity and electrical conductivity.", marks: 6, module: 1, freq: 4 },
        { q: "Find the mobility of electrons in copper: 9×10²⁸ valence electrons/m³, conductivity = 6×10⁷ mho/m.", marks: 3, module: 1, freq: 3 },
        { q: "Explain BCS theory of superconductivity. Give four applications of superconductors.", marks: 6, module: 1, freq: 3 },
        { q: "Pb has transition temperature 7.26K and maximum critical field 8×10⁵ A/m. Find temperature for superconducting use in field 4×10⁴ A/m.", marks: 3, module: 1, freq: 3 },
        { q: "Starting from a plane wave equation, derive time dependent Schrodinger's wave equation.", marks: 6, module: 2, freq: 4 },
        { q: "Derive the expression for eigenfunction for a particle in one-dimensional infinite square well potential.", marks: 6, module: 2, freq: 4 },
        { q: "Find the two lowest energy levels of an electron in 1D infinite square well of width 3Å.", marks: 3, module: 2, freq: 3 },
        { q: "State and explain uncertainty principle. Show non-existence of electrons inside the nucleus.", marks: 6, module: 2, freq: 4 },
        { q: "An electron is trapped in a 1D box of length 0.1nm. Calculate energy to excite from ground state to second excited state.", marks: 3, module: 2, freq: 3 },
        { q: "Obtain the time independent Schrodinger equation from time dependent Schrodinger equation.", marks: 6, module: 2, freq: 3 },
        { q: "Derive expression for density of electrons in the conduction band of an intrinsic semiconductor.", marks: 6, module: 3, freq: 4 },
        { q: "Prove that the Fermi level in an intrinsic semiconductor at 0K lies at the middle of valence and conduction bands.", marks: 3, module: 3, freq: 3 },
        { q: "Explain formation of p-n junction with energy band diagram at equilibrium. Mark Fermi level and directions of diffusion and drift.", marks: 6, module: 3, freq: 4 },
        { q: "Calculate diode current in silicon diode at 25°C with forward bias of 0.5V.", marks: 3, module: 3, freq: 3 },
        { q: "Derive expression for density of holes in the valence band of an intrinsic semiconductor.", marks: 6, module: 3, freq: 3 },
        { q: "A germanium diode at room temperature has forward current 2mA at 0.3V. Calculate reverse saturation current.", marks: 3, module: 3, freq: 3 },
        { q: "Explain centre-tap and bridge type full wave rectifiers with diagrams. Obtain efficiency and ripple factor.", marks: 9, module: 4, freq: 5 },
        { q: "What is a photodiode? Explain construction and working of a PIN photodiode.", marks: 5, module: 4, freq: 3 },
        { q: "Write four applications of photodiodes.", marks: 4, module: 4, freq: 2 },
        { q: "Explain construction, working and V-I characteristics of a solar cell. Write expression for efficiency and fill factor.", marks: 6, module: 4, freq: 4 },
        { q: "A silicon diode with internal resistance 30Ω used for half wave rectification. Input = 6sin(ωt)V, load = 500Ω. Find dc output voltage, ac input power, and efficiency.", marks: 3, module: 4, freq: 3 },
        { q: "Explain working of half wave rectifier. Derive expression for efficiency.", marks: 6, module: 4, freq: 4 },
        { q: "Full wave centre-tap rectifier: diode resistance 20Ω, rms secondary voltage 300V, load 980Ω. Find mean load current, rms load current, dc output power.", marks: 3, module: 4, freq: 3 }
      ]
    }
  },

  "GXCYT122 - Chemistry for Information Science and Electrical Science": {
    scheme: "2024",
    semester: "S1",
    isNumerical: true,
    formulas: [
      "E_cell = E°_cell - (RT/nF)ln Q (Nernst equation)",
      "E°_cell = E°_cathode - E°_anode",
      "ΔG = -nFE (Gibbs free energy)",
      "A = εlc (Beer-Lambert law)",
      "Hardness (ppm) = (mass of CaCO₃ equivalent / volume in L) × 1000"
    ],
    syllabus: "Module 1: Electrochemistry, Nernst Equation, Reference Electrodes, Corrosion & Cathodic Protection, Li-ion & Fuel Cells. Module 2: Nanomaterials, OLED, DSSC, Conducting Polymers. Module 3: Spectroscopy (UV-Vis, IR), Thermal Analysis (DETA), SEM. Module 4: Water characteristics, Hardness, Disinfection, Reverse Osmosis, Sewage treatment.",
    pyq: "Guaranteed numerical questions on calculating temporary/permanent hardness of water. Expect 6-mark questions on Li-ion cells, OLEDs, or UV-Vis Spectrometers.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Write any three differences between electrochemical series and galvanic series.", marks: 3, module: 1, freq: 3 },
        { q: "What is a fuel cell? Write chemical reactions at anode and cathode in H₂-O₂ fuel cell with acid electrolyte.", marks: 3, module: 1, freq: 4 },
        { q: "Write any three applications of carbon nanotubes (CNTs).", marks: 3, module: 2, freq: 3 },
        { q: "How is polyaniline synthesised?", marks: 3, module: 2, freq: 3 },
        { q: "Write any three applications of Dielectric Thermal Analysis (DETA).", marks: 3, module: 3, freq: 2 },
        { q: "Which will have higher λ_max: ethene or 1,3-butadiene? Explain.", marks: 3, module: 3, freq: 3 },
        { q: "What is COD? Give its significance.", marks: 3, module: 4, freq: 3 },
        { q: "Calculate the temporary, permanent and total hardness: Ca(HCO₃)₂=6ppm, Mg(HCO₃)₂=8ppm, CaSO₄=10ppm, MgSO₄=15ppm.", marks: 3, module: 4, freq: 5 },
        { q: "Write anode and cathode reactions and calculate standard EMF for cell formed by silver and aluminium electrodes.", marks: 3, module: 1, freq: 3 },
        { q: "Explain single electrode potential.", marks: 3, module: 1, freq: 3 },
        { q: "What are conducting polymers? Give two examples.", marks: 3, module: 2, freq: 3 },
        { q: "Explain the sol-gel method for synthesis of nanomaterials.", marks: 3, module: 2, freq: 3 },
        { q: "How can IR spectroscopy distinguish intra and intermolecular hydrogen bonds?", marks: 3, module: 3, freq: 3 },
        { q: "Define dissolved oxygen. Give one significance.", marks: 3, module: 4, freq: 2 },
        { q: "Explain water disinfection by chlorination.", marks: 3, module: 4, freq: 3 },
        { q: "Calculate temporary and permanent hardness: Mg(HCO₃)₂=8mg/L, Ca(HCO₃)₂=6mg/L, CaSO₄=8mg/L, MgSO₄=10mg/L.", marks: 3, module: 4, freq: 4 }
      ],
      partB_Detailed: [
        { q: "Discuss the design of a glass electrode and how it measures pH of a solution.", marks: 6, module: 1, freq: 3 },
        { q: "How can sacrificial anodic protection prevent corrosion?", marks: 3, module: 1, freq: 3 },
        { q: "Describe the construction and working of Li-ion cell.", marks: 6, module: 1, freq: 5 },
        { q: "Write any three applications of electrochemical series.", marks: 3, module: 1, freq: 3 },
        { q: "Explain impressed current cathodic protection.", marks: 3, module: 1, freq: 3 },
        { q: "Discuss the construction and working of H₂-O₂ fuel cell using acid electrolyte. Give one advantage.", marks: 6, module: 1, freq: 4 },
        { q: "How are nanomaterials classified based on dimension?", marks: 6, module: 2, freq: 3 },
        { q: "Discuss construction and working of OLED. Give two advantages.", marks: 6, module: 2, freq: 4 },
        { q: "Describe synthesis of polyaniline. List two properties and applications.", marks: 6, module: 2, freq: 3 },
        { q: "Describe the instrumentation of scanning electron microscope (SEM).", marks: 6, module: 3, freq: 3 },
        { q: "Explain the various electronic transitions in electronic spectroscopy.", marks: 6, module: 3, freq: 3 },
        { q: "Discuss the IR activity of various vibrational modes of CO₂ molecule.", marks: 3, module: 3, freq: 3 },
        { q: "Discuss instrumentation and working of UV-Visible spectrometer.", marks: 6, module: 3, freq: 4 },
        { q: "Calculate concentration of solution showing 20% transmittance in 2cm cell.", marks: 3, module: 3, freq: 3 },
        { q: "Explain the principle and procedure of ion exchange process for water softening.", marks: 6, module: 4, freq: 4 },
        { q: "Explain principle and procedure of ion exchange process.", marks: 6, module: 4, freq: 3 },
        { q: "Describe trickling filter method in sewage water treatment.", marks: 3, module: 4, freq: 3 }
      ]
    }
  },

  "UCEST105 - Algorithmic Thinking with Python": {
    scheme: "2024",
    semester: "S1",
    isNumerical: false,
    formulas: [
      "T(n) = 2T(n/2) + n → O(n log n) (Merge Sort)",
      "T(n) = T(n-1) + 1 → O(n) (Linear recursion)",
      "fib(n) = fib(n-1) + fib(n-2) (Fibonacci DP)",
      "Time complexity: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)"
    ],
    syllabus: "Module 1: Problem-solving strategies, Python Essentials. Module 2: Algorithm vs Pseudocode, Flowcharts, Complexity basics. Module 3: Control flow, Pattern printing, Prime numbers, Factorial. Module 4: Functions, Recursion, Advanced Paradigms (Divide and Conquer, Greedy, Dynamic Programming, Memoization vs Tabulation).",
    pyq: "Heavily applied. Guaranteed 6-mark scenario questions on Divide & Conquer or Greedy algorithms. Memoization and Tabulation for Fibonacci are highly probable. Part A frequently asks for Flowcharts or basic algorithms.",
    exactPyqs: {
      partA_3Marks: [
        { q: "You are asked to solve a jigsaw puzzle without a reference picture. How will you solve it using trial and error method?", marks: 3, module: 1, freq: 3 },
        { q: "Given the input '12345', write a Python code snippet to check if it is numeric.", marks: 3, module: 1, freq: 2 },
        { q: "Draw the flowchart to generate the first 'n' numbers in the Fibonacci sequence.", marks: 3, module: 2, freq: 4 },
        { q: "Write an algorithm to check whether the input integer is Palindrome or not.", marks: 3, module: 2, freq: 3 },
        { q: "Write a Python program to find the sum of even numbers from N given numbers.", marks: 3, module: 3, freq: 3 },
        { q: "What is the motivation for using a randomized approach in problem-solving?", marks: 3, module: 1, freq: 2 },
        { q: "Write an algorithm for recovering a 4-digit numeric password.", marks: 3, module: 1, freq: 2 },
        { q: "Write the output: (i) for count in range(-10,-20,-2): print(count) (ii) for i in range(10,-1,-2): print(i) (iii) 2*3**2**2", marks: 3, module: 3, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Explain how backtracking strategy can be applied to solve Sudoku problem.", marks: 5, module: 1, freq: 3 },
        { q: "Explain how heuristics approach can be used to find the best restaurant for dinner.", marks: 4, module: 1, freq: 2 },
        { q: "How will you apply Means-Ends Analysis to develop campus management software?", marks: 6, module: 1, freq: 3 },
        { q: "Write a pseudocode to implement a grading system: Marks≥90: A, Marks≥80: B, Marks≥70: C, Marks≥60: D, else: F.", marks: 6, module: 2, freq: 4 },
        { q: "Write an algorithm to print delivery times divisible by 6 but not by 4.", marks: 3, module: 2, freq: 3 },
        { q: "Write the pseudocode to determine the largest and smallest numbers in a list of N numbers.", marks: 6, module: 2, freq: 4 },
        { q: "Write the pseudocode to calculate the factorial of a given number using a for loop.", marks: 3, module: 2, freq: 3 },
        { q: "Write a Python tool that generates the first 'n' Fibonacci numbers using recursion.", marks: 5, module: 3, freq: 4 },
        { q: "Write a program that accepts the length of three sides of a triangle and determines if it is a right triangle.", marks: 4, module: 3, freq: 3 },
        { q: "Write a Python program using recursion to find LCM of two integers a and b using GCD relationship.", marks: 6, module: 3, freq: 3 },
        { q: "Write a Python program to reorganize characters: all capitals first, then small letters, digits, special characters.", marks: 3, module: 3, freq: 2 },
        { q: "Develop an efficient algorithm using Divide and Conquer to find the sum of the two smallest loan interest rates.", marks: 6, module: 4, freq: 4 },
        { q: "Compare and contrast greedy approach and dynamic programming approach.", marks: 3, module: 4, freq: 4 },
        { q: "Explain memoization and tabulation techniques in dynamic programming for calculating the n-th Fibonacci number.", marks: 6, module: 4, freq: 5 },
        { q: "Develop a greedy algorithm to determine the maximum number of tasks completable in a given total time limit.", marks: 3, module: 4, freq: 3 }
      ]
    }
  },

  "GMEST103 - Engineering Graphics and Computer Aided Drawing": {
    scheme: "2024",
    semester: "S1",
    isNumerical: false,
    formulas: [
      "Isometric scale = cos30°/cos45° = 0.816 × true length",
      "True length from projections: TL = √(TV² + difference in elevation²)",
      "Ellipse: x²/a² + y²/b² = 1"
    ],
    syllabus: "Module 1: Projection of points and straight lines inclined to both planes. Module 2: Projection of simple solids (Prisms, Pyramids, Cone, Cylinder). Module 3: Sections of Solids and Development of Surfaces. Module 4: Isometric Projection of prisms, pyramids, spheres, and combinations.",
    pyq: "No Part A. All questions are 15-mark drawing questions. Expect complex combination solids in Module 4 and auxiliary section planes in Module 3.",
    exactPyqs: {
      partA_3Marks: [],
      partB_Detailed: [
        { q: "The top and front views of line AB are inclined at 35° and 45° to XY. One end is on HP and VP, other end 50mm above HP. Draw projections, find true length and inclinations.", marks: 15, module: 1, freq: 3 },
        { q: "Line PQ 80mm long, one end 50mm in front of VP and 15mm above HP. Top view is 65mm. Other end is 20mm in front of VP and above HP. Draw projections, find true inclinations, show traces.", marks: 15, module: 1, freq: 4 },
        { q: "Line MN 75mm long, top view 65mm, front view 55mm. End M is 20mm above HP and 10mm in front of VP. Draw orthographic projections, determine true inclinations, apparent inclinations and traces.", marks: 15, module: 1, freq: 3 },
        { q: "Line CD: end C 10mm above HP and 20mm in front of VP. Front view 55mm inclined at 40° to HP. Top view is 55mm. Find true length, true inclinations and traces.", marks: 15, module: 1, freq: 3 },
        { q: "Pentagonal prism base edge 25mm, axis 65mm, placed with one base edge on HP. Axis inclined 30° to HP and 45° to VP. Draw projections.", marks: 15, module: 2, freq: 4 },
        { q: "Cone of base diameter 40mm, axis 60mm, resting on VP on one generator with front view of axis inclined 35° to HP. Draw projections.", marks: 15, module: 2, freq: 3 },
        { q: "Pentagonal prism, side 30mm, axis 80mm, rests on a base corner on HP, slant edge inclined 45° to HP and 45° to VP. Draw projections.", marks: 15, module: 2, freq: 3 },
        { q: "Pentagonal pyramid base edge 30mm, height 50mm. Resting on HP on one base edge, axis 45° with HP and 40° with VP. Draw projections.", marks: 15, module: 2, freq: 3 },
        { q: "Regular hexagonal pyramid base edge 30mm, axis 80mm on its base, one edge parallel to VP. Cut by a plane through centre of axis and extreme left corner. Draw sectional views and true shape.", marks: 15, module: 3, freq: 4 },
        { q: "Cylinder 50cm diameter, cut by 30° auxiliary section plane through the extreme right point of base. Shortest portion is 1m. Draw development.", marks: 15, module: 3, freq: 3 },
        { q: "Cylinder 60mm height, 50mm diameter on HP. Cut by plane perpendicular to VP, inclined 40° to HP, cutting axis 10mm below top face. Draw projections and true shape.", marks: 15, module: 3, freq: 3 },
        { q: "Right circular cone base diameter 50mm, height 60mm. Section plane perpendicular to VP, inclined 30° to HP, bisecting axis. Draw development.", marks: 15, module: 3, freq: 3 },
        { q: "Hemisphere radius 50mm rests centrally on top of square prism base edge 40mm, height 60mm. Draw isometric projection.", marks: 15, module: 4, freq: 4 },
        { q: "Draw isometric view of pentagonal pyramid side 30mm, height 60mm resting centrally on cylinder diameter 90mm, height 50mm.", marks: 15, module: 4, freq: 3 },
        { q: "Sphere of 70mm diameter kept centrally on top of cylindrical slab 60mm diameter, 10mm thickness. Draw isometric view.", marks: 15, module: 4, freq: 4 },
        { q: "Sphere of 25mm radius kept on top of rectangular block (80×60×15). Sphere rests 30mm from two adjacent top edges. Draw isometric projection.", marks: 15, module: 4, freq: 3 }
      ]
    }
  },

  "GXEST104 - Introduction to Electrical and Electronics Engineering": {
    scheme: "2024",
    semester: "S1",
    isNumerical: true,
    formulas: [
      "V = IR (Ohm's law)",
      "P = VI cosφ (AC Power)",
      "Z = √(R²+(XL-XC)²) (Impedance)",
      "XL = 2πfL, XC = 1/(2πfC)",
      "η = (2/π²) × (RL/rd+RL) × 100% (Full wave rectifier efficiency ≈ 81.2%)",
      "Ripple factor γ = √((Irms/Idc)²-1)",
      "Vout/Vin = -Rf/R1 (Inverting Op-Amp)",
      "IC = βIB (BJT relation)"
    ],
    syllabus: "PART 1: ELECTRICAL (30 Marks) - Module 1: DC Circuits & Magnetic Fields. Module 2: AC Circuits. PART 2: ELECTRONICS (30 Marks) - Module 3: Electronic Devices & Circuits. Module 4: Communication Systems & Instrumentation.",
    pyq: "Balanced split. PART 1 guarantees a heavy circuit analysis problem in Module 1 and a numeric calculation on power in Module 2. PART 2 consistently tests RC coupled amplifier or MOSFET in Module 3, and FM receiver or block diagrams in Module 4.",
    exactPyqs: {
      partA_3Marks: [
        { q: "State and explain Kirchhoff's laws.", marks: 3, module: 1, freq: 4 },
        { q: "Define: (i) Magnetic Flux density (ii) Magnetomotive force (iii) Magnetic field Strength.", marks: 3, module: 1, freq: 3 },
        { q: "Define active power, reactive power, and apparent power.", marks: 3, module: 2, freq: 4 },
        { q: "Show that for a sinusoidal voltage RMS value is 0.707 times its maximum value.", marks: 3, module: 2, freq: 3 },
        { q: "Draw the block diagram of a DC power supply and explain.", marks: 3, module: 3, freq: 4 },
        { q: "Differentiate between Zener and Avalanche breakdown.", marks: 3, module: 3, freq: 3 },
        { q: "With the help of a neat block diagram, explain the components of a basic communication system.", marks: 3, module: 4, freq: 3 },
        { q: "Explain the need for modulation.", marks: 3, module: 4, freq: 3 }
      ],
      partB_Detailed: [
        { q: "In the given circuit, find the mesh currents I₁, I₂, I₃ using KVL (20V battery, 5Ω, 4Ω, 3Ω resistors with opposing batteries).", marks: 9, module: 1, freq: 4 },
        { q: "Calculate the equivalent resistance between points A and B in the given network.", marks: 6, module: 1, freq: 3 },
        { q: "Define reluctance. List the factors on which reluctance of a magnetic material depends.", marks: 3, module: 1, freq: 3 },
        { q: "A coil of resistance 12Ω and inductive reactance 25Ω connected in series with capacitive reactance 41Ω to 230V, 50Hz. Find impedance, current and power.", marks: 6, module: 2, freq: 4 },
        { q: "A 3-phase 400V 50Hz supply feeds delta-connected load: 25Ω resistance, 0.15H inductance, 120µF capacitor in series per phase. Find impedance, power factor, line current, apparent/active/reactive power.", marks: 6, module: 2, freq: 3 },
        { q: "List three advantages of three-phase system over single-phase system.", marks: 3, module: 2, freq: 3 },
        { q: "Explain construction and working of n-channel enhancement type MOSFET with figures.", marks: 7, module: 3, freq: 4 },
        { q: "Draw the frequency response of an RC coupled amplifier. Explain why gain reduces at low and high frequencies.", marks: 5, module: 3, freq: 4 },
        { q: "Explain working of a PN junction diode when forward biased.", marks: 4, module: 3, freq: 3 },
        { q: "Explain working of an FM receiver based on superheterodyne principle.", marks: 6, module: 4, freq: 4 },
        { q: "What are advantages of optical communication?", marks: 3, module: 4, freq: 3 },
        { q: "With a neat block diagram, explain components of an electronic instrumentation system.", marks: 6, module: 4, freq: 3 }
      ]
    }
  },

  "GCEST104 - Introduction to Civil and Mechanical Engineering": {
    scheme: "2024",
    semester: "S1",
    isNumerical: false,
    formulas: [
      "Thermal efficiency of Carnot engine: η = 1 - (T₂/T₁)",
      "Diesel cycle efficiency: η = 1 - (1/r^(γ-1)) × [(ρ^γ-1)/(γ(ρ-1))]",
      "Plinth area = Built-up area at plinth level",
      "FAR = Total floor area / Plot area"
    ],
    syllabus: "PART 1: MECHANICAL (30 Marks) - Module 1: IC Engines & Power Plants. Module 2: Manufacturing Processes, Machine Tools, Power Transmission. PART 2: CIVIL (30 Marks) - Module 3: Civil Engineering overview, Building Materials. Module 4: Building Construction and basic infrastructure.",
    pyq: "Balanced split. Mechanical frequently asks Carnot cycle, SI/CI engines, arc welding or lathe operations. Civil guarantees questions on residential building components, advantages of construction materials, and site selection.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Draw the P-V and T-S diagram of Diesel cycle and list the processes involved.", marks: 3, module: 1, freq: 3 },
        { q: "Draw a diagram representing CRDI fuel system in automobiles and label the parts.", marks: 3, module: 1, freq: 2 },
        { q: "What are rolling mills? Briefly explain any two types.", marks: 3, module: 2, freq: 3 },
        { q: "What is 3D printing?", marks: 3, module: 2, freq: 2 },
        { q: "List any six parts of an internal combustion engine.", marks: 3, module: 1, freq: 3 },
        { q: "Explain the concept of hybrid vehicles.", marks: 3, module: 1, freq: 2 },
        { q: "What is the purpose of bearings? Write the classification of bearings.", marks: 3, module: 2, freq: 2 },
        { q: "With a simple sketch, explain the principle of electric arc welding.", marks: 3, module: 2, freq: 4 },
        { q: "Explain built up area and floor area ratio (FAR).", marks: 3, module: 3, freq: 3 },
        { q: "Differentiate between load bearing and non-load bearing structure.", marks: 3, module: 3, freq: 3 },
        { q: "Explain the advantages and disadvantages of timber as a construction material.", marks: 3, module: 3, freq: 4 },
        { q: "What is rapid hardening cement? What are its advantages and uses?", marks: 3, module: 4, freq: 3 },
        { q: "How does civil engineering influence infrastructure development of the nation?", marks: 3, module: 3, freq: 2 },
        { q: "List the various uses of stones.", marks: 3, module: 3, freq: 3 },
        { q: "How is quick setting cement different from rapid hardening cement and ordinary cement?", marks: 3, module: 4, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Explain the working of a four-stroke SI engine with diagrams.", marks: 6, module: 1, freq: 4 },
        { q: "Compare two-stroke and four-stroke IC engines.", marks: 3, module: 1, freq: 3 },
        { q: "Carnot engine operates between T₁=800K and T₂=300K. Calculate thermal efficiency.", marks: 3, module: 1, freq: 3 },
        { q: "Explain working of a four-stroke Diesel engine with neat sketches.", marks: 6, module: 1, freq: 4 },
        { q: "Discuss the layout of hydroelectric power plant. List its merits and demerits.", marks: 6, module: 1, freq: 3 },
        { q: "Write three differences between CI and SI engines.", marks: 3, module: 1, freq: 3 },
        { q: "Explain the principle of forging. Describe drop forging and upset forging operations.", marks: 5, module: 2, freq: 3 },
        { q: "Explain the process of Arc welding with a diagram.", marks: 4, module: 2, freq: 4 },
        { q: "What are different types of drives for power transmission? Give advantages and disadvantages of belt drives.", marks: 6, module: 2, freq: 3 },
        { q: "With a neat sketch, explain turning and facing operations on a lathe.", marks: 3, module: 2, freq: 3 },
        { q: "What is forging? Briefly explain closed die forging and open die forging.", marks: 6, module: 2, freq: 3 },
        { q: "List any six machining operations that can be performed on a lathe with simple sketches.", marks: 9, module: 2, freq: 4 },
        { q: "Discuss any three factors to be considered in selecting a site for a residential building.", marks: 3, module: 3, freq: 4 },
        { q: "Explain the basic elements of a residential building and its function with a neat sketch.", marks: 6, module: 3, freq: 4 },
        { q: "Explain any four major disciplines of civil engineering.", marks: 6, module: 3, freq: 3 },
        { q: "Explain the various components of a building with a neat sketch and give at least one function of each.", marks: 9, module: 3, freq: 4 },
        { q: "Define: (i) Plinth area (ii) Carpet area (iii) Floor area.", marks: 3, module: 3, freq: 3 },
        { q: "List factors to be considered while selecting a residential building site.", marks: 6, module: 3, freq: 3 },
        { q: "Explain any 3 types of cement with composition and uses.", marks: 3, module: 4, freq: 3 },
        { q: "Explain any four tests to determine the quality of bricks.", marks: 6, module: 4, freq: 4 },
        { q: "Compare English bond with Flemish bond.", marks: 3, module: 4, freq: 3 },
        { q: "Explain briefly the components of water supply system.", marks: 6, module: 4, freq: 3 },
        { q: "List the advantages and disadvantages of M-sand.", marks: 3, module: 4, freq: 3 },
        { q: "What are the field tests to determine the quality of cement?", marks: 6, module: 4, freq: 3 },
        { q: "What are the functions of a foundation?", marks: 3, module: 4, freq: 3 },
        { q: "Compare load bearing and framed structures.", marks: 6, module: 4, freq: 3 }
      ]
    }
  },

  "HUN101 - Life Skills": {
    scheme: "2024",
    semester: "S1",
    isNumerical: false,
    formulas: [],
    syllabus: "Module 1: Self-awareness, Personality, Values, Emotional intelligence. Module 2: Communication skills, Listening, Reading, Writing. Module 3: Leadership, Teamwork, Conflict resolution. Module 4: Stress management, Time management, Goal setting.",
    pyq: "Essay questions on emotional intelligence and leadership appear frequently. Communication skills and listening comprehension in Part A. Stress management strategies are commonly asked.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Define emotional intelligence. List its key components.", marks: 3, module: 1, freq: 3 },
        { q: "What is self-awareness? Why is it important for personal development?", marks: 3, module: 1, freq: 3 },
        { q: "Differentiate between hearing and listening.", marks: 3, module: 2, freq: 4 },
        { q: "What are the barriers to effective communication?", marks: 3, module: 2, freq: 4 },
        { q: "Define leadership. List any three qualities of a good leader.", marks: 3, module: 3, freq: 4 },
        { q: "What is conflict resolution? Name any two conflict resolution strategies.", marks: 3, module: 3, freq: 3 },
        { q: "What is stress? List any three causes of stress among students.", marks: 3, module: 4, freq: 4 },
        { q: "Explain the concept of SMART goals.", marks: 3, module: 4, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Explain the Johari Window model and its significance in self-awareness.", marks: 6, module: 1, freq: 3 },
        { q: "Discuss the role of emotional intelligence in personal and professional success.", marks: 6, module: 1, freq: 4 },
        { q: "Explain the VARK model of learning styles.", marks: 6, module: 2, freq: 3 },
        { q: "What are the key principles of effective communication? Explain any four.", marks: 6, module: 2, freq: 4 },
        { q: "Explain different styles of leadership with examples.", marks: 6, module: 3, freq: 4 },
        { q: "How can teamwork and collaboration improve organizational performance?", marks: 6, module: 3, freq: 3 },
        { q: "Discuss various time management techniques for students.", marks: 6, module: 4, freq: 4 },
        { q: "Explain any three stress management strategies applicable to engineering students.", marks: 6, module: 4, freq: 4 }
      ]
    }
  },

  // ==========================================
  // 2024 SCHEME — S2 SUBJECTS
  // ==========================================

  "GXEST204 - Programming in C": {
    scheme: "2024",
    semester: "S2",
    isNumerical: false,
    formulas: [
      "malloc(n * sizeof(type)) — allocates n uninitialized memory blocks",
      "calloc(n, sizeof(type)) — allocates n zero-initialized memory blocks",
      "free(ptr) — deallocates dynamic memory",
      "ftell(fp) — returns current file position",
      "fseek(fp, offset, origin) — moves file pointer"
    ],
    syllabus: "Module 1: Basics of C, Operators, Expressions, Control Statements. Module 2: Arrays (1D, 2D), Strings. Module 3: Functions, Recursion, Structures, Unions. Module 4: Pointers, Dynamic Memory Allocation (malloc, calloc), File Handling.",
    pyq: "Module 4 heavily tests File Handling operations (putc, getc) and Pointers with Structures. Module 3 guarantees questions comparing Recursion vs Iteration, and writing recursive C programs for Fibonacci/Factorial.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Calculate and print the result of the following expression in C: int result = 8 + 3 * (10 - 6) / 2; printf(\"%d\", result);", marks: 3, module: 1, freq: 3 },
        { q: "Differentiate between entry-controlled and exit-controlled loops in C.", marks: 3, module: 1, freq: 3 },
        { q: "What will be the output of the following C program? int a=5; int b=9; printf(\"%d\", a & b);", marks: 3, module: 1, freq: 3 },
        { q: "What are the uses of the ftell() and fseek() functions in C?", marks: 3, module: 4, freq: 4 }
      ],
      partB_Detailed: [
        { q: "Write a C program to insert a new element into an existing array at a given position and shift elements.", marks: 5, module: 2, freq: 3 },
        { q: "Write a C program to compute the nth Fibonacci number using recursion.", marks: 3, module: 3, freq: 4 },
        { q: "Write a C program to define a structure Book (title, author, price) and display a book's details.", marks: 4, module: 3, freq: 3 },
        { q: "Write a C program that creates 'output.txt', writes 'Learning C is fun!' using putc(), reopens using getc(), and closes properly.", marks: 6, module: 4, freq: 4 },
        { q: "Compare malloc() and calloc() in terms of dynamic memory allocation.", marks: 3, module: 4, freq: 4 },
        { q: "Write a C program that uses a structure named Time with hours and minutes, and implements functions to add and subtract time using pointers.", marks: 6, module: 4, freq: 3 }
      ]
    }
  },

  "GAMAT201 - Mathematics for Information Science 2": {
    scheme: "2024",
    semester: "S2",
    isNumerical: true,
    formulas: [
      "Rank: Row reduce to echelon form, count non-zero rows",
      "Eigenvalue: det(A - λI) = 0",
      "Gram-Schmidt: u₁ = v₁, u₂ = v₂ - (v₂·u₁/u₁·u₁)u₁",
      "Standard matrix: [T(e₁) | T(e₂) | ... | T(eₙ)]",
      "Cauchy-Schwarz: |<u,v>| ≤ ||u|| · ||v||"
    ],
    syllabus: "Module 1: Matrix Theory, Rank, Eigenvalues, Diagonalization. Module 2: Vector Spaces, Subspaces, Basis, Dimension. Module 3: Inner Product Spaces, Cauchy-Schwarz, Gram-Schmidt orthogonalization. Module 4: Linear Transformations, Kernel, Range, Standard matrix.",
    pyq: "Guaranteed 9-mark questions on Diagonalization and Gram-Schmidt Orthonormalization. Module 4 heavily tests finding the Kernel, Range, and Standard Matrix of a linear transformation.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Find the rank of the matrix [[1, -1, 0], [1, 3, -1], [5, 3, -2]].", marks: 3, module: 1, freq: 3 },
        { q: "Show that W = {(x1, x2) | x1>=0, x2>=0} with standard operations, is not a subspace of R^2.", marks: 3, module: 2, freq: 3 },
        { q: "Find the eigen values of [[3, -2], [9, -6]].", marks: 3, module: 1, freq: 4 },
        { q: "Find the value of k so that the vectors u=(1,2) and v=(k,-1) are orthogonal.", marks: 3, module: 3, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Diagonalize the matrix [[1, 1, 3], [1, 5, 1], [3, 1, 1]].", marks: 9, module: 1, freq: 5 },
        { q: "Apply Gram-Schmidt orthonormalization process to transform the given basis B={(1,1),(0,1)} into an orthonormal basis.", marks: 5, module: 3, freq: 4 },
        { q: "Verify the Cauchy-Schwarz inequality for A=[[1, -1], [2, 0]] with B=[[1, 1], [0, 3]].", marks: 4, module: 3, freq: 3 },
        { q: "Find the standard matrix for the linear transformation T(x,y,z)=(x+y, x-y, z-x).", marks: 5, module: 4, freq: 4 },
        { q: "Determine whether the transformation T(x,y) = (x-y, x+3y) is linear. If it is, find the standard matrix.", marks: 5, module: 4, freq: 3 }
      ]
    }
  },

  "GYMAT201 - Mathematics for Electrical and Physical Science 2": {
    scheme: "2024",
    semester: "S2",
    isNumerical: true,
    formulas: [
      "Gradient: ∇f = (∂f/∂x)i + (∂f/∂y)j + (∂f/∂z)k",
      "Directional derivative: D_u f = ∇f · u",
      "Green's theorem: ∮(P dx + Q dy) = ∬(∂Q/∂x - ∂P/∂y) dA",
      "Stokes' theorem: ∮F·dr = ∬(∇×F)·dS",
      "Divergence theorem: ∯F·dS = ∭(∇·F) dV"
    ],
    syllabus: "Module 1 & 2: Multivariable Calculus, Partial Derivatives. Module 3: Vector Calculus, Directional Derivatives, Independence of Path. Module 4: Multiple Integrals, Green's Theorem, Stokes' Theorem, Divergence Theorem.",
    pyq: "Module 4 guarantees 5-mark questions on verifying/applying Green's, Stoke's, or Divergence theorems. Module 3 heavily tests Directional Derivatives.",
    exactPyqs: {
      partA_3Marks: [
        { q: "If f(x,y) = 4x^3y^2 + 5x - 2y, find the partial derivatives with respect to x and y at (1,2).", marks: 3, module: 1, freq: 3 },
        { q: "Show that d^2f/(dydx) = d^2f/(dxdy) if f(x,y) = x^2y + xy^2.", marks: 3, module: 1, freq: 3 },
        { q: "Show that the integral I = integral(y sin x dx - cos x dy) is independent of the path.", marks: 3, module: 3, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Find the directional derivative of f(x,y,z)=x^2yz+4xz^2 at P(1,-2,-1) in the direction of a vector from P to Q(3,-3,-2).", marks: 4, module: 3, freq: 3 },
        { q: "Use the divergence theorem to find the outward Flux of the vector field F(x,y,z) = 2xi + 3yj + z^2k across the unit cube.", marks: 5, module: 4, freq: 4 },
        { q: "Verify Green's theorem for integral y^2dx + x^2dy, where C is the square with vertices (0,0), (1,0), (1,1) and (0,1).", marks: 4, module: 4, freq: 4 },
        { q: "Use Stoke's theorem to evaluate closed integral F.dr where F = (2x-y)i - yz^2j - y^2zk for the upper half of the sphere x^2+y^2+z^2=1.", marks: 5, module: 4, freq: 3 }
      ]
    }
  },

  "GCCYT122 - Chemistry for Physical Science": {
    scheme: "2024",
    semester: "S2",
    isNumerical: true,
    formulas: [
      "Nernst equation: E = E° - (RT/nF)ln Q",
      "Beer-Lambert: A = εlc",
      "Hardness (ppm) = (CaCO₃ equivalent mass / volume) × 10⁶",
      "BOD: measures biodegradable organic matter by O₂ consumed",
      "COD: measures all oxidizable matter by chemical oxidation"
    ],
    syllabus: "Module 1: Nanomaterials, Green Chemistry. Module 2: Electrochemistry, Corrosion. Module 3: Instrumental Methods (IR, SEM, DTA). Module 4: Water Technology (Hardness, RO, BOD/COD).",
    pyq: "Focus on comparing analytical techniques (BOD vs COD, SEM principles) and calculating water hardness. Standard Hydrogen Electrode (SHE) and Reverse Osmosis frequently appear.",
    exactPyqs: {
      partA_3Marks: [
        { q: "What is green hydrogen? Give any two characteristics of it.", marks: 3, module: 1, freq: 2 },
        { q: "What are the differences in the structure of graphene, carbon nanotube, and fullerene?", marks: 3, module: 1, freq: 3 },
        { q: "Describe the construction of the Standard Hydrogen Electrode (SHE). Point out its limitations.", marks: 3, module: 2, freq: 3 },
        { q: "Define Chemical Oxygen Demand (COD). How does it differ from BOD?", marks: 3, module: 4, freq: 4 }
      ],
      partB_Detailed: [
        { q: "Explain how IR spectroscopy can be used for the identification of functional groups and to distinguish intermolecular and intramolecular hydrogen bonding.", marks: 4, module: 3, freq: 3 },
        { q: "What is the working principle of scanning electron microscopy (SEM)? Give any two applications.", marks: 3, module: 3, freq: 3 },
        { q: "A hard water sample contains Ca2+=45 ppm, Mg2+=28 ppm, Na+=54 ppm, and HCO3-=148 ppm. Calculate the temporary, permanent and total hardness.", marks: 3, module: 4, freq: 4 },
        { q: "Describe the UASB (Upflow Anaerobic Sludge Blanket) process.", marks: 3, module: 4, freq: 3 }
      ]
    }
  },

  "GBPHT121 - Physics for Electrical Science": {
    scheme: "2024",
    semester: "S2",
    isNumerical: true,
    formulas: [
      "Fermi energy: EF = (h²/2m)(3π²n)^(2/3)",
      "Numerical aperture: NA = √(n₁²-n₂²)",
      "Critical field: Hc(T) = H₀[1-(T/Tc)²]",
      "Diode equation: I = I₀[e^(eV/kT) - 1]",
      "Acceptance angle: θ_a = sin⁻¹(NA)"
    ],
    syllabus: "Module 1: Semiconductors. Module 2: Solar Cells, Dielectrics. Module 3: Superconductivity. Module 4: Lasers (Ruby, Semiconductor) and Optical Fibres.",
    pyq: "Heavy emphasis on deriving numerical aperture for optical fibres and explaining the working of Ruby lasers (9 marks). Expect questions on Fermi energy and dielectric constants.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Define fermi energy. Give the significance of fermi level.", marks: 3, module: 1, freq: 3 },
        { q: "Distinguish between avalanche breakdown and Zener breakdown.", marks: 3, module: 1, freq: 3 },
        { q: "Explain the working of PIN photodiode.", marks: 3, module: 2, freq: 3 },
        { q: "Mention any 6 applications of superconductors.", marks: 3, module: 3, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Explain the construction and working of a solar cell. Draw its characteristics curve.", marks: 6, module: 2, freq: 4 },
        { q: "Calculate the relative permittivity of KCl, when subjected to an electric field of 500V/m and resulting polarisation is 4X10^-8 C/m^2.", marks: 3, module: 2, freq: 3 },
        { q: "Explain the construction and working of a Ruby laser.", marks: 9, module: 4, freq: 5 },
        { q: "Describe the principle of light propagation in optical fibers and derive the expression for numerical aperture.", marks: 9, module: 4, freq: 5 }
      ]
    }
  },

  "PCCST205 - Discrete Mathematics": {
    scheme: "2024",
    semester: "S2",
    isNumerical: true,
    formulas: [
      "Lagrange's theorem: |H| divides |G| for subgroup H of G",
      "Recurrence: aₙ = c₁aₙ₋₁ + c₂aₙ₋₂ (linear homogeneous)",
      "Generating function: G(x) = Σaₙxⁿ",
      "Strong induction: P(k) for all k ≤ n implies P(n+1)",
      "Group order: |G| = number of elements"
    ],
    syllabus: "Module 1: Set Theory, Operations. Module 2: Generating Functions, Recurrence Relations. Module 3: Mathematical Induction. Module 4: Algebraic Structures, Groups, Subgroups, Homomorphisms.",
    pyq: "Module 4 strongly focuses on proving Subgroups and applying Lagrange's theorem. Module 2 & 3 guarantee questions on solving recurrence relations and mathematical induction proofs.",
    exactPyqs: {
      partA_3Marks: [
        { q: "If A={1,2,3,4}, B={3,4,5,6}, and U={1,2,3,4,5,6,7,8}, find a) A U B, b) A n B, c) (A U B)'.", marks: 3, module: 1, freq: 3 },
        { q: "What are the steps in strong mathematical induction? How is it different from ordinary induction?", marks: 4, module: 3, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Solve the recurrence relation: a_n = 3a_n-1 + 2^n with a_0 = 0. What is the order of the recurrence relation?", marks: 5, module: 2, freq: 4 },
        { q: "Use mathematical induction to prove that 7^(n+2) + 8^(2n+1) is divisible by 57 for every non-negative integer n.", marks: 4, module: 3, freq: 4 },
        { q: "Let G=(Z,+). Show that the set H={nk/k in Z} is a subgroup of G, where n is a fixed integer.", marks: 5, module: 4, freq: 4 },
        { q: "Find all subgroups of the cyclic group Z_12, and identify their generators.", marks: 5, module: 4, freq: 3 },
        { q: "State and prove Lagrange's theorem.", marks: 4, module: 4, freq: 4 }
      ]
    }
  },

  "PCCET205 - Mechanics of Solids": {
    scheme: "2024",
    semester: "S2",
    isNumerical: true,
    formulas: [
      "σ = F/A (Normal stress)",
      "ε = ΔL/L (Normal strain)",
      "E = σ/ε (Young's modulus)",
      "Bulk modulus K = E / (3(1-2ν))",
      "Section modulus Z = I/y",
      "Principal stress: σ₁,₂ = (σx+σy)/2 ± √[((σx-σy)/2)²+τ²]"
    ],
    syllabus: "Module 1: Stress, Strain, Modulus of Elasticity, Poisson's Ratio. Module 2: Beams, Section Modulus. Module 3: Column failures. Module 4: Principal Stresses.",
    pyq: "Focuses on stress distribution diagrams, analyzing principal planes, and calculating values based on elasticity principles.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Draw the stress strain diagram of mild steel and mark its salient points.", marks: 3, module: 1, freq: 4 },
        { q: "If the values of modulus of elasticity and Poisson's ratio for an alloy body are 150 GPa and 0.25 respectively, determine the value of bulk modulus.", marks: 3, module: 1, freq: 3 },
        { q: "Explain any 3 types of beams.", marks: 3, module: 2, freq: 3 },
        { q: "Define Section Modulus. Write the Expression for rectangular cross section having width 'b' and depth 'd'.", marks: 2, module: 2, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Explain the failure of long columns and short columns.", marks: 2, module: 3, freq: 3 },
        { q: "A plane element in a body is subjected to a tensile stress of 100 MPa accompanied by a clockwise shear stress of 25 MPa. Find the normal and shear stress on a plane inclined at 20 degrees.", marks: 9, module: 4, freq: 4 }
      ]
    }
  },

  // ==========================================
  // 2024 SCHEME — S3 SUBJECTS
  // ==========================================

  "PCCST303 - Data Structures and Algorithms": {
    scheme: "2024",
    semester: "S3",
    isNumerical: false,
    formulas: [
      "Linear search: O(n)",
      "Binary search: O(log n)",
      "Quick sort average: O(n log n), worst: O(n²)",
      "Hash function: h(k) = k mod m",
      "Linear probing: h(k,i) = (h(k)+i) mod m",
      "Quadratic probing: h(k,i) = (h(k)+i²) mod m",
      "BFS/DFS: O(V+E)"
    ],
    syllabus: "Module 1: Algorithm Analysis, Time Complexity, Stacks. Module 2: Trees, Binary Trees. Module 3: Graphs (BFS, DFS). Module 4: Sorting (Quick Sort), Searching, Hashing.",
    pyq: "Module 4 heavily tests Quick Sort execution and resolving collisions in Hash Tables (Linear/Quadratic Probing). Part A covers time complexity calculations and basic stack operations.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Compute the time complexity of the following code fragment: for(i=0;i<n;i++) for(j=n;j>0;j=j/2) printf(\"DATA STRUCTURE\");", marks: 3, module: 1, freq: 4 },
        { q: "Write algorithm for push and pop operations of a stack using array.", marks: 3, module: 1, freq: 3 },
        { q: "Explain the following terms with examples: i) Full binary tree ii) Complete binary tree.", marks: 3, module: 2, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Write an algorithm to perform Breadth First Search (BFS) on a given graph from source vertex.", marks: 6, module: 3, freq: 4 },
        { q: "Write algorithm to sort an array using quick sort. Apply quick-sort to sort the numbers 45,33,56,22,76,78,40 and 30.", marks: 6, module: 4, freq: 5 },
        { q: "Given the values 72,13,6,5,10,36,43 and 17 and a hash table of size 11, show the resultant table by using hash function h(k)=k%11 with Linear Probing and Quadratic Probing.", marks: 6, module: 4, freq: 5 }
      ]
    }
  },

  "PBCST304 - Object Oriented Programming": {
    scheme: "2024",
    semester: "S3",
    isNumerical: false,
    formulas: [
      "JVM stack: method frames pushed/popped per call",
      "try-catch-finally: finally always executes",
      "JDBC URL: jdbc:subprotocol:subname",
      "Event delegation: Source → Event Object → Listener → Handler"
    ],
    syllabus: "Module 1: JVM, JIT Compiler. Module 2: Basics of Java. Module 3: Exception Handling (try, catch, throw, throws, finally). Module 4: Swing GUI components, Event Delegation Model, JDBC Database Connectivity.",
    pyq: "Module 4 heavily focuses on creating Swing GUI applications and demonstrating the steps to connect Java to a database using JDBC.",
    exactPyqs: {
      partA_3Marks: [
        { q: "What is the role of the Just-In-Time (JIT) compiler in the JVM? Explain how it improves performance.", marks: 2, module: 1, freq: 3 },
        { q: "What is the output of this code snippet: int n=29; System.out.println(n%2==0 ? \"Even\" : \"Odd\");", marks: 2, module: 2, freq: 2 },
        { q: "Differentiate checked and unchecked exceptions in Java. Give suitable examples.", marks: 2, module: 3, freq: 4 }
      ],
      partB_Detailed: [
        { q: "What is exception handling in Java? Explain try, catch, throw, throws, finally with suitable examples.", marks: 4, module: 3, freq: 5 },
        { q: "Write a Java program using Swing components to create a simple 'Login' application.", marks: 4, module: 4, freq: 4 },
        { q: "What are the steps to connect to a JDBC? Explain with an example program.", marks: 4, module: 4, freq: 5 },
        { q: "How does the Delegation Event Model work in Swing applications?", marks: 2, module: 4, freq: 3 }
      ]
    }
  },

  // ==========================================
  // 2019 SCHEME — S1 SUBJECTS
  // ==========================================

  "MAT101 - Linear Algebra and Calculus": {
    scheme: "2019",
    semester: "S1",
    isNumerical: true,
    formulas: [
      "det(A - λI) = 0 (Eigenvalue equation)",
      "∫∫f(x,y)dxdy (Double integral)",
      "Taylor: f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...",
      "Fourier: a₀ = (1/π)∫f(x)dx",
      "Ratio test: lim|aₙ₊₁/aₙ| < 1 for convergence"
    ],
    syllabus: "Module 1: Linear systems, Gauss elimination, Rank, Eigenvalues/vectors, Diagonalization. Module 2: Partial derivatives, Chain rule, Total derivative, Maxima/Minima, Lagrange multipliers. Module 3: Double/Triple integrals, Reversing order of integration. Module 4: Convergence tests, Alternating series, Leibnitz test. Module 5: Taylor/Maclaurin series, Fourier series, Half-range series.",
    pyq: "Guaranteed 14-mark questions on Reversing Order of Integration and Diagonalizing matrices. High probability on Convergence tests (Ratio/Root, Leibnitz). Saddle points and extrema are heavily tested in Module 2.",
    exactPyqs: {
      partA_3Marks: [
        { q: "Find the rank of the matrix [[1,2,3],[2,4,6],[1,2,4]].", marks: 3, module: 1, freq: 3 },
        { q: "Find the eigenvalues of the matrix [[2,1],[1,2]].", marks: 3, module: 1, freq: 4 },
        { q: "Find the partial derivatives ∂f/∂x and ∂f/∂y for f(x,y) = x²y + xy².", marks: 3, module: 2, freq: 3 },
        { q: "Evaluate ∫₀¹∫₀¹ xy dxdy.", marks: 3, module: 3, freq: 3 },
        { q: "Test the convergence of Σ(1/n²) using p-series test.", marks: 3, module: 4, freq: 3 },
        { q: "Find the Maclaurin series of eˣ up to 4 terms.", marks: 3, module: 5, freq: 4 }
      ],
      partB_Detailed: [
        { q: "Diagonalize the matrix A = [[4,1],[2,3]]. Find P and D such that A = PDP⁻¹.", marks: 14, module: 1, freq: 4 },
        { q: "Find the maximum and minimum values of f(x,y) = x²+y²-x-y+1 on the region x²+y²≤1.", marks: 14, module: 2, freq: 3 },
        { q: "Evaluate ∫∫ x²y dA over the region bounded by y=x and y=x². Reverse order if needed.", marks: 14, module: 3, freq: 5 },
        { q: "Test convergence of the series Σ(n!/nⁿ) using ratio test.", marks: 7, module: 4, freq: 3 },
        { q: "Find the Fourier series of f(x) = x² in the interval (-π, π).", marks: 14, module: 5, freq: 4 },
        { q: "Find the Taylor series expansion of f(x) = sin x about x = π/4.", marks: 7, module: 5, freq: 3 }
      ]
    }
  },

  // ==========================================
  // 2019 SCHEME — S3 SUBJECTS
  // ==========================================

  "CST201 - Data Structures": {
    scheme: "2019",
    semester: "S3",
    isNumerical: false,
    formulas: [
      "AVL Balance Factor = h(left subtree) - h(right subtree), must be -1, 0, or +1",
      "Binary Search: O(log n)",
      "Bubble/Selection/Insertion Sort: O(n²)",
      "Merge Sort/Quick Sort average: O(n log n)",
      "Heap Sort: O(n log n)",
      "BFS/DFS: O(V+E)"
    ],
    syllabus: "Module 1: Arrays, Linked lists, Stacks, Queues. Module 2: Trees, Binary trees, BST, AVL trees, Heaps. Module 3: Graphs, BFS, DFS, Spanning trees. Module 4: Sorting algorithms, Searching, Hashing. Module 5: Algorithm complexity, Space-time tradeoff.",
    pyq: "AVL tree rotations and BST operations are guaranteed. Graph traversal BFS/DFS with step-by-step execution is heavily tested. Sorting comparisons and complexity analysis appear in almost every paper.",
    exactPyqs: {
      partA_3Marks: [
        { q: "What is the difference between a stack and a queue? Give one real-life example for each.", marks: 3, module: 1, freq: 4 },
        { q: "Write the algorithm for inserting a node at the beginning of a singly linked list.", marks: 3, module: 1, freq: 3 },
        { q: "Define AVL tree. What is the balance factor?", marks: 3, module: 2, freq: 4 },
        { q: "What is a binary search tree? Write the properties.", marks: 3, module: 2, freq: 3 },
        { q: "Explain BFS traversal with an example.", marks: 3, module: 3, freq: 4 },
        { q: "Define spanning tree. What is a minimum spanning tree?", marks: 3, module: 3, freq: 3 },
        { q: "Compare bubble sort and selection sort.", marks: 3, module: 4, freq: 3 },
        { q: "What is hashing? Explain collision resolution by chaining.", marks: 3, module: 4, freq: 3 },
        { q: "Define Big-O notation. Give examples of O(1), O(n), O(n²).", marks: 3, module: 5, freq: 3 }
      ],
      partB_Detailed: [
        { q: "Explain singly linked list. Write algorithms for insertion, deletion, and traversal with examples.", marks: 14, module: 1, freq: 4 },
        { q: "Write and explain the algorithm for implementing a stack using arrays. Show push, pop, and display operations with example.", marks: 14, module: 1, freq: 3 },
        { q: "Insert the elements 50, 30, 70, 20, 40, 60, 80 into a BST. Show step-by-step tree construction. Then delete 30 and redraw the tree.", marks: 14, module: 2, freq: 5 },
        { q: "Explain AVL tree with all four rotation types (LL, RR, LR, RL) with examples. Insert 10, 20, 30, 40, 50 into an AVL tree step by step.", marks: 14, module: 2, freq: 5 },
        { q: "Explain BFS and DFS traversal algorithms for a graph. Trace both traversals on a given graph starting from vertex A.", marks: 14, module: 3, freq: 5 },
        { q: "Explain Prim's algorithm for finding minimum spanning tree. Apply it on the given weighted graph step by step.", marks: 14, module: 3, freq: 4 },
        { q: "Write and explain merge sort algorithm. Trace the algorithm on [38, 27, 43, 3, 9, 82, 10].", marks: 14, module: 4, freq: 4 },
        { q: "Compare all sorting algorithms: Bubble, Selection, Insertion, Merge, Quick, Heap sort in terms of best, average, worst case complexity.", marks: 14, module: 5, freq: 4 }
      ]
    }
  }

};

// ==========================================
// SCHEME RULES
// ==========================================
export const SCHEME_RULES = {
  "2024": {
    internalMax: 40,
    externalMax: 60,
    totalMax: 100,
    minInternal: 26,
    minExternal: 24,
    minTotal: 50,
    modules: 4,
    partA: { questionsToAnswer: 5, marksEach: 3, totalMarks: 15 },
    partB: { questionsPerModule: 2, choosePerModule: 1, marksEach: 9, totalMarks: 45 },
    note: "Minimum 26/40 internal AND minimum 24/60 external AND minimum 50/100 total required to pass."
  },
  "2019": {
    internalMax: 50,
    externalMax: 100,
    totalMax: 150,
    minInternal: 25,
    minExternal: 35,
    minTotal: 75,
    modules: 5,
    partA: { questionsToAnswer: 10, marksEach: 3, totalMarks: 30 },
    partB: { questionsPerModule: 2, choosePerModule: 1, marksEach: 14, totalMarks: 70 },
    note: "Minimum 25/50 internal AND minimum 35/100 external AND minimum 75/150 total required to pass."
  }
};

// ==========================================
// DEPARTMENT NAMES
// ==========================================
export const deptNames = {
  CSE: "Computer Science (CSE)",
  AIML: "AI & Machine Learning (AIML)",
  IT: "Information Technology (IT)",
  ME: "Mechanical Engineering (ME)",
  CE: "Civil Engineering (CE)",
  ECE: "Electronics & Communication (ECE)",
  EEE: "Electrical & Electronics (EEE)"
};

// ==========================================
// STUDY DATA (Scheme → Dept → Semester → Subjects)
// ==========================================
export const studyData = {
  "2024": {
    CSE: {
      S1: [
        "GAMAT101 - Mathematics for Information Science 1",
        "UCEST105 - Algorithmic Thinking with Python",
        "GAPHT121 - Physics for Information Science",
        "GXCYT122 - Chemistry for Information Science and Electrical Science",
        "GMEST103 - Engineering Graphics and Computer Aided Drawing",
        "GXEST104 - Introduction to Electrical and Electronics Engineering",
        "HUN101 - Life Skills"
      ],
      S2: [
        "GAMAT201 - Mathematics for Information Science 2",
        "GXEST204 - Programming in C",
        "PCCST205 - Discrete Mathematics"
      ],
      S3: [
        "PCCST303 - Data Structures and Algorithms",
        "PBCST304 - Object Oriented Programming"
      ],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    AIML: {
      S1: [
        "GAMAT101 - Mathematics for Information Science 1",
        "UCEST105 - Algorithmic Thinking with Python",
        "GAPHT121 - Physics for Information Science",
        "GXCYT122 - Chemistry for Information Science and Electrical Science",
        "GMEST103 - Engineering Graphics and Computer Aided Drawing",
        "GXEST104 - Introduction to Electrical and Electronics Engineering",
        "HUN101 - Life Skills"
      ],
      S2: [
        "GAMAT201 - Mathematics for Information Science 2",
        "GXEST204 - Programming in C",
        "PCCST205 - Discrete Mathematics"
      ],
      S3: [
        "PCCST303 - Data Structures and Algorithms",
        "PBCST304 - Object Oriented Programming"
      ],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    IT: {
      S1: [
        "GAMAT101 - Mathematics for Information Science 1",
        "UCEST105 - Algorithmic Thinking with Python",
        "GAPHT121 - Physics for Information Science",
        "GXCYT122 - Chemistry for Information Science and Electrical Science",
        "GMEST103 - Engineering Graphics and Computer Aided Drawing",
        "GXEST104 - Introduction to Electrical and Electronics Engineering",
        "HUN101 - Life Skills"
      ],
      S2: [
        "GAMAT201 - Mathematics for Information Science 2",
        "GXEST204 - Programming in C",
        "PCCST205 - Discrete Mathematics"
      ],
      S3: [
        "PCCST303 - Data Structures and Algorithms",
        "PBCST304 - Object Oriented Programming"
      ],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    ME: {
      S1: [
        "GYMAT101 - Mathematics for Electrical Science and Physical Science - 1",
        "UCEST105 - Algorithmic Thinking with Python",
        "GAPHT121 - Physics for Information Science",
        "GXCYT122 - Chemistry for Information Science and Electrical Science",
        "GMEST103 - Engineering Graphics and Computer Aided Drawing",
        "GCEST104 - Introduction to Civil and Mechanical Engineering",
        "HUN101 - Life Skills"
      ],
      S2: [
        "GYMAT201 - Mathematics for Electrical and Physical Science 2",
        "GXEST204 - Programming in C",
        "PCCET205 - Mechanics of Solids"
      ],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    CE: {
      S1: [
        "GYMAT101 - Mathematics for Electrical Science and Physical Science - 1",
        "UCEST105 - Algorithmic Thinking with Python",
        "GAPHT121 - Physics for Information Science",
        "GXCYT122 - Chemistry for Information Science and Electrical Science",
        "GMEST103 - Engineering Graphics and Computer Aided Drawing",
        "GCEST104 - Introduction to Civil and Mechanical Engineering",
        "HUN101 - Life Skills"
      ],
      S2: [
        "GYMAT201 - Mathematics for Electrical and Physical Science 2",
        "GXEST204 - Programming in C",
        "GCCYT122 - Chemistry for Physical Science",
        "GBPHT121 - Physics for Electrical Science",
        "PCCET205 - Mechanics of Solids"
      ],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    ECE: {
      S1: [
        "GYMAT101 - Mathematics for Electrical Science and Physical Science - 1",
        "UCEST105 - Algorithmic Thinking with Python",
        "GAPHT121 - Physics for Information Science",
        "GXCYT122 - Chemistry for Information Science and Electrical Science",
        "GMEST103 - Engineering Graphics and Computer Aided Drawing",
        "GXEST104 - Introduction to Electrical and Electronics Engineering",
        "HUN101 - Life Skills"
      ],
      S2: [
        "GYMAT201 - Mathematics for Electrical and Physical Science 2",
        "GXEST204 - Programming in C",
        "GBPHT121 - Physics for Electrical Science"
      ],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    EEE: {
      S1: [
        "GYMAT101 - Mathematics for Electrical Science and Physical Science - 1",
        "UCEST105 - Algorithmic Thinking with Python",
        "GAPHT121 - Physics for Information Science",
        "GXCYT122 - Chemistry for Information Science and Electrical Science",
        "GMEST103 - Engineering Graphics and Computer Aided Drawing",
        "GXEST104 - Introduction to Electrical and Electronics Engineering",
        "HUN101 - Life Skills"
      ],
      S2: [
        "GYMAT201 - Mathematics for Electrical and Physical Science 2",
        "GXEST204 - Programming in C",
        "GBPHT121 - Physics for Electrical Science"
      ],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    }
  },  
  "2019": {
    CSE: {
      S1: [
        "MAT101 - Linear Algebra and Calculus",
        "PHT100 - Engineering Physics A",
        "CYT100 - Engineering Chemistry",
        "EST110 - Engineering Graphics",
        "EST130 - Basics of Electrical & Electronics",
        "HUN101 - Life Skills"
      ],
      S2: [
        "MAT102 - Vector Calculus, Differential Equations",
        "EST100 - Engineering Mechanics",
        "EST120 - Basics of Civil & Mechanical",
        "HUN102 - Professional Communication"
      ],
      S3: [
        "MAT203 - Discrete Mathematical Structures",
        "CST201 - Data Structures",
        "CST203 - Logic System Design",
        "CST205 - Object Oriented Programming using Java",
        "MCN201 - Sustainable Engineering"
      ],
      S4: [
        "MAT206 - Graph Theory",
        "CST202 - Computer Organization and Architecture",
        "CST204 - Operating Systems",
        "CST206 - Database Management Systems",
        "MCN202 - Constitution of India"
      ],
      S5: [
        "CST301 - Formal Languages and Automata Theory",
        "CST303 - Computer Networks",
        "CST305 - System Software",
        "CST307 - Microprocessors and Microcontrollers",
        "CST309 - Management of Software Systems"
      ],
      S6: [
        "CST302 - Compiler Design",
        "CST304 - Computer Graphics and Image Processing",
        "CST306 - Algorithm Analysis and Design",
        "CST308 - Comprehensive Course Work",
        "HUT300 - Industrial Economics"
      ],
      S7: ["CST401 - Artificial Intelligence", "MCN401 - Industrial Safety Engineering"],
      S8: ["CST402 - Distributed Computing", "CST404 - Comprehensive Course Viva"]
    },
    ECE: {
      S1: [
        "MAT101 - Linear Algebra and Calculus",
        "PHT100 - Engineering Physics A",
        "EST130 - Basics of Electrical & Electronics"
      ],
      S2: ["Coming Soon..."],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    ME: {
      S1: [
        "MAT101 - Linear Algebra and Calculus",
        "PHT110 - Engineering Physics B",
        "EST120 - Basics of Civil & Mechanical"
      ],
      S2: ["Coming Soon..."],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    CE: {
      S1: [
        "MAT101 - Linear Algebra and Calculus",
        "PHT110 - Engineering Physics B",
        "EST120 - Basics of Civil & Mechanical"
      ],
      S2: ["Coming Soon..."],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    EEE: {
      S1: [
        "MAT101 - Linear Algebra and Calculus",
        "PHT100 - Engineering Physics A",
        "EST130 - Basics of Electrical & Electronics"
      ],
      S2: ["Coming Soon..."],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    IT: {
      S1: [
        "MAT101 - Linear Algebra and Calculus",
        "PHT100 - Engineering Physics A"
      ],
      S2: ["Coming Soon..."],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    },
    AIML: {
      S1: [
        "MAT101 - Linear Algebra and Calculus",
        "PHT100 - Engineering Physics A"
      ],
      S2: ["Coming Soon..."],
      S3: ["Coming Soon..."],
      S4: ["Coming Soon..."],
      S5: ["Coming Soon..."],
      S6: ["Coming Soon..."],
      S7: ["Coming Soon..."],
      S8: ["Coming Soon..."]
    }
  }
};