export const mandatoryDocumentsByTab = {
  building: {
    // Mandatory fields inside Design Review accordion
    designReview: [
    "Architectural Details drawing",
    "Architectural Design report",
    "Architectural Site plan and Work",
    "Building Structural analysis",
    "Building Details Structural drawings",
    "Building Structural Design report (Statical Report)",
    "Building Structural Geotechnical report",
    "Building Details Sanitary drawings",
    "Building Sanitary Design report",
    "Building Sanitary Site plan",
    "Building Electrical Details drawings",
    "Building Electrical Design report",
    "Building Electrical Site plan",
    "Building Mechanical Details drawings",
    "Building Mechanical Details drawings",
    "Building Mechanical Design report",
    "Building Mechanical Site plan",
    "Building Bill of quantity specification",
    "Building Standard Bid Document",
    "Building DB Projects",
    "Building Engineering Estimation",
    // Add other mandatory building documents from the review
  ],
   // Mandatory fields inside Cost Approval accordion
    costApproval: [
      "Permit Letter from the Federal Public Procurement and Property Administration",
      "Cost Breakdown Submission",
      "Current Construction Price Reference",
      "Verification of Local Suppliers",
      "labor hourly price",
      "Equipment hourly price",
    ],
    // Mandatory fields inside Design Build Projects accordion
    designBuild: [
      "Terms of Reference (TOR)",
      "Particular specifications",
      "Contract document (SBD) for DB, DBO, EPC",
    ],
    // Letter accordion – always required (one document)
    letter: ["Building Design Review Request Letter"], // adjust name to match your category
  },


  transport: {
    designReview: [
    "Transport Communication Detail Engineering Design Report",
    "Transport Communication Surveying Data",
    "Transport Communication Details drawings",
    "Transport Communication Bill of Quantities",
    "Transport Communication Standard Bid Documents",
    "Transport Communication Drainage Design Report",
    "Transport Communication Bridge Design Report",
    "Transport Communication Hydrological and Hydraulic Design Report", // new mandatory
    "Transport Communication Bridge Structural Analysis Files",
    "Transport Communication Traffic and Safety Drawings",
  ],
  // Mandatory fields inside Cost Approval accordion
    costApproval: [
      "Permit Letter from the Federal Public Procurement and Property Administration",
      "Cost Breakdown Submission",
      "Current Construction Price Reference",
      "Verification of Local Suppliers",
      "labor hourly price",
      "Equipment hourly price",
    ],
    // Mandatory fields inside Design Build Projects accordion
    designBuild: [
      "Terms of Reference (TOR)",
      "Particular specifications",
      "Contract document (SBD) for DB, DBO, EPC",
    ],
    // Letter accordion – always required (one document)
    letter: ["Transport Communication Design Review Request Letter"], // adjust name to match your category
  },
   water: {
    // For each sub-accordion we define its mandatory docs
    subAccordions: {
      "Water Supply": [
        "Water Supply letter",
        "Water Supply Standard Bid Document",
        "Water Supply Design report",
        "Water Supply Technical Specifications and Bill of quantity",
        "Water Supply Engineering Estimation",
        "Water Supply Environmental and Social Impact Assessments",
        "Water Supply Operation and Maintenance Manuals",
        "Water Supply Design Drawings",
      ],
      "Irrigation": [
        "Irrigation letter",
        "Irrigation Engineering estimation",
        "Irrigation Initiation and Planning Docs",
        "Irrigation Impact Assessments",
        "Irrigation Standard Bid Document",
        "Irrigation O&M Manuals",
        "Irrigation Design Reports",
        "Irrigation Bill Of Quantity",
        "Irrigation Design Drawings",
      ],
      "Waste Water": [
        "Waste Water letter",
        "Waste Water TOR",
        "Waste Water Plant specs",
        "Waste Water Standard Bid Document",
        "Waste Water Bill Of Quantity",
        "Waste Water Design Drawings",
        "Waste Water Operational manual",
      ],
      "Energy (Hydropower,Wind,Solar,Geo thermal)": [
        "Energy letter",
        "Energy Planning and Preliminary Studies",
        "Energy Detailed Design Docs",
        "Energy Bill Of Quantity",
        "Energy Standard Bid Document",
        "Energy Monitoring Plans",
        "Energy Risk Assessments",
        "Energy O&M Manuals",
      ],
      "Dam Projects": [
        "Dam Design report documents",
        "Dam Specification and Bill of Quantity",
        "Dam Standard Bid Document",
        "Dam Risk assessment document",
        "Dam Operation and Maintenance manual",
        "Dam Drawing documents",
        "Dam Engineering estimation",
        "Dam letter",
      ],
    },
    costApproval: [ 
      "Permit Letter from the Federal Public Procurement and Property Administration",
      "Cost Breakdown Submission",
      "Current Construction Price Reference",
      "Verification of Local Suppliers",
      "labor hourly price",
      "Equipment hourly price",
     ],
    designBuild: [ 
      "Terms of Reference (TOR)",
      "Particular specifications",
      "Contract document (SBD) for DB, DBO, EPC",
     ],
    globalLetter: ["Water and Energy Design Review Request Letter"], // if separate global letter exists
  },
  others: {
    allMandatory: [
      "Design by Others Letter",
      "Design by others Special work( consultant SBD)",
      "Design by Other DC Review",
      "Design by Other Price escalation",
    ],
  },
};

// Helper to get all mandatory doc names (for asterisk)
export const allMandatoryDocumentNames = new Set(
  Object.values(mandatoryDocumentsByTab).flatMap(tab => 
    Object.values(tab).flat()
  )
);