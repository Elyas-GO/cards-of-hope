import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project-owner/_main/field-placeholder')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/project-owner/_main/field-placeholder"!</div>
}
export const  getFileTypeHint = (docName: string): string => {
  const hints: Record<string, string> = {
    // Architectural Design
    "Architectural Details drawing": "DWG, PDF (CAD drawings)",
    "Architectural 3D Model": "RVT, SKP, 3DM,PDF (3D model files)",
    "Architectural Design report": "PDF, DOCX (Design report)",
    "Architectural Site plan and Work": "DWG, PDF (Site plans)",
    "Architectural Topographical data with contour": "DWG, GIS (Topo data)",

    // Structural Design
    "Building Structural analysis": "PDF, XLSX, XLS, DXF, S2K, SDB, EDB, E2K, EXR (ETABS file format, SAP file format)",
    "Building Details Structural drawings": "DWG, PDF (Structural drawings)",
    "Building Structural Design report (Statical Report)": "PDF, DOCX (Design report)",
    "Building Structural Geotechnical report": "PDF, DOCX (Geo report)",

    // Sanitary Design
    "Building Details Sanitary drawings": "DWG, PDF (Sanitary drawings)",
    "Building Sanitary Design report": "PDF, DOCX (Design report)",
    "Building Sanitary Site plan": "DWG, PDF (Site plans)",
    "Building Sanitary Topographical data with contour": "DWG, GIS (Topo data)",

    // Electrical Design
    "Building Electrical Details drawings": "DWG, PDF (Electrical drawings)",
    "Building Electrical Design report": "PDF, DOCX (Design report)",
    "Building Electrical Site plan": "DWG, PDF (Site plans)",
    "Building Electrical Topographical data with contour": "DWG, GIS (Topo data)",

    // Mechanical Design
    "Building Mechanical Details drawings": "DWG, PDF (Mechanical drawings)",
    "Building Mechanical Design report": "PDF, DOCX (Design report)",
    "Building Mechanical Site plan": "DWG, PDF (Site plans)",
    "Building Mechanical Topographical data with contour": "DWG, GIS (Topo data)",

    // Site Works
    "Building Site Road and Fence": "DWG, PDF (Site drawings)",
    "Building Site Landscape Compound": "DWG, PDF (Landscape plans)",
    "Building Site Sanitary Works": "DWG, PDF (Sanitary plans)",
    "Building Site Electrical Works": "DWG, PDF (Electrical plans)",
    //"Building Site Software results": "PDF, XLSX (Analysis results)",
    "Building Site Details design": "DWG, PDF (Design details)",

    // BOQ and Specs
    "Building Bill of quantity specification": "XLSX, XLS, PDF (BOQ documents)",
    "Building Take off Sheets": "XLSX, XLS, PDF (Quantity sheets)",
    "Building Approved Design Document": "PDF (Approved designs)",

    // SBD
    "Building Standard Bid Document": "PDF (Bid documents)",

    // Others
    "Building DB Projects": "PDF, DOCX (Project documents)",
    "Building Engineering Estimation": "XLSX, XLS, PDF (Estimation files)",

    // Transport & Communication
    "Transport Communication Detail Engineering Design Report": "PDF, DOCX (Design report)",
    "Transport Communication Surveying Data": "DWG, GIS (Survey data)",
    "Transport Communication Feasibility study Report": "PDF, DOCX (Feasibility study)",
    "Transport Communication Route Selection Report": "PDF, DOCX (Route selection)",
    "Transport Communication Resettlement action plan": "PDF, DOCX (Action plan)",
    "Transport Communication Site Investigation Report": "PDF, DOCX (Site investigation)",
    "Transport Communication Geotechnical Design Report": "PDF, DOCX (Geo report)",
    "Transport Communication Geometric Design Report": "PDF, DOCX (Design report)",
    "Transport Communication Pavement Design Report": "PDF, DOCX (Design report)",
    "Transport Communication Drainage Design Report": "PDF, DOCX (Design report)",
    "Transport Communication Bridge Design Report": "PDF, DOCX (Design report)",
    "Transport Communication Standard Safety and Environmental Procedures report": "PDF, DOCX (Safety procedures)",
    "Transport Communication Details drawings": "DWG, PDF (Detailed drawings)",
    "Transport Communication Bill of Quantities": "XLSX, XLS, PDF (BOQ documents)",
    "Transport Communication Standard Bid Documents": "PDF (Bid documents)",

    // Water Supply
    "Water Supply letter": "PDF, DOCX (Project initiation letter)",
    "Water Supply Standard Bid Document": "PDF, DOCX (Bid documents)",
    "Water Supply Design report": "PDF, DOCX (Design report)",
    "Water Supply Technical Specifications and Bill of quantity": "XLSX, XLS, PDF, DOCX (BOQ documents)",
    "Water Supply Engineering Estimation": "XLSX, XLS, PDF (Estimation files)",
    "Water Supply Environmental and Social Impact Assessments": "PDF, DOCX (Assessment reports)",
    "Water Supply Operation and Maintenance Manuals": "PDF, DOCX (Operation manuals)",
    "Water Supply Design Drawings": "DWG, PDF (Design drawings)",

    // Irrigation
    "Irrigation letter": "PDF, DOCX (Project initiation letter)",
    "Irrigation Engineering estimation": "XLSX, XLS, PDF, DOCX (Estimation files)",
    "Irrigation Initiation and Planning Docs": "PDF, DOCX (Planning documents)",
    "Irrigation Impact Assessments": "PDF, DOCX (Assessment reports)",
    "Irrigation Standard Bid Document": "PDF (Bid documents)",
    "Irrigation O&M Manuals": "PDF, DOCX (Operation manuals)",
    "Irrigation Design Reports": "PDF, DOCX (Design reports)",
    "Irrigation Bill Of Quantity": "XLSX, XLS, PDF (BOQ documents)",
    "Irrigation Design Drawings": "DWG, PDF (Design drawings)",

    // Waste Water
    "Waste Water letter": "PDF, DOCX (Project initiation letter)",
    "Waste Water TOR": "PDF, DOCX (Terms of reference)",
    "Waste Water Site and Environmental Studies": "PDF, DOCX (Study reports)",
    "Waste Water Plant specs": "PDF, DOCX (Specifications)",
    "Waste Water Standard Bid Document": "PDF (Bid documents)",
    "Waste Water Bill Of Quantity": "XLSX, XLS, PDF (BOQ documents)",
    "Waste Water Design Drawings": "DWG, PDF (Design drawings)",
    "Waste Water Operational manual": "PDF, DOCX (Operation manual)",

    // Energy
    "Energy letter": "PDF, DOCX (Project initiation letter)",
    "Energy Planning and Preliminary Studies": "PDF, DOCX (Study reports)",
    "Energy Detailed Design Docs": "PDF, DOCX (Design documents)",
    "Energy Bill Of Quantity": "XLSX, XLS, PDF (BOQ documents)",
    "Energy Standard Bid Document": "PDF (Bid documents)",
    "Energy Monitoring Plans": "PDF, DOCX (Monitoring plans)",
    "Energy Risk Assessments": "PDF, DOCX (Risk assessments)",
    "Energy O&M Manuals": "PDF, DOCX (Operation manuals)",

    //Dam
    "Dam letter": "PDF, DOCX",
    "Dam Planning and feasibility study document": "PDF, DOCX",
    "Dam Environmental Impact assessment": "PDF, DOCX",
    "Dam Design report documents": "PDF, DOCX",
    "Dam Specification and Bill of Quantity": "XLSX, XLS, PDF, DOCX",
    "Dam Standard Bid Document": "PDF, DOCX",
    "Dam Risk assessment document": "PDF, DOCX",
    "Dam Operation and Maintenance manual": "PDF, DOCX",
    "Dam Drawing documents": "DWG, PDF",
    "Dam Engineering estimation": "XLSX, XLS, PDF, DOCX", 

    //coast approval
    "Permit Letter from the Federal Public Procurement and Property Administration": "PDF, DOCX",
    "Cost Breakdown Submission": "XLSX",
    "Current Construction Price Reference": "PDF, DOCX",
    "Verification of Local Suppliers": "PDF, DOCX",
    "labor hourly price": "PDF, DOCX",
    "Equipment hourly price": "PDF, DOCX",
    //Design Build projects
    "Terms of Reference (TOR)": "PDF, DOCX",
    "Particular specifications": "PDF, DOCX",
    "Contract document (SBD) for DB, DBO, EPC": "PDF, DOCX",
    "Bill of Quantity (BOQ)- optional": "XLSX, XLS, PDF, DOCX",
    "Drawings- optional": "PDF, DWG",

    //Design By Others
    "Design by Others Letter": "PDF, DOCX",
    "Design by others Special work( consultant SBD)": "PDF, DOCX",
    "Design by Other DC Review": "PDF, XLSX, XLS",
    "Design by Other Price escalation": "PDF, DOCX, XLSX, XLS",
};
  


  return hints[docName] || "PDF, DOCX, XLSX, XLS, DWG";
};
