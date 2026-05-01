import { createFileRoute } from "@tanstack/react-router";

export const documentCategoryIds: Record<string, string> = {
  "Architectural Details drawing": "709467ba-1ed9-4ec8-83f2-d8dccb60504a",
  "Architectural 3D Model": "3f1f973c-4e0a-4127-a3ae-98173efd2fe3",
  "Architectural Design report": "da702762-2b23-4cec-8c69-8fa0ab5665d4",
  "Architectural Site plan and Work": "b86d7511-0df1-43b5-bdfb-62aba3c87e81",
  "Architectural Topographical data with contour": "388b11b1-c845-4950-a9b6-c49c0aa5bbb5",
  "Building Structural analysis": "3da0a0b9-60b5-4934-8e2f-229ad751e9d7",
  "Building Details Structural drawings": "174ea533-8c60-46a8-8172-5c3b3683cf2f",
  "Building Structural Design report (Statical Report)": "b9c85ceb-cd41-4794-a0ef-8b0320c270ea",
  "Building Structural Geotechnical report": "5b09faaf-ba66-4981-b069-3832c357019a",
  "Building Details Sanitary drawings": "4c86cdfb-4f33-4660-82c3-40b4bd0f95c6",
  "Building Sanitary Design report": "f01711b2-007b-4708-91fa-538c16ad0fae",
  "Building Sanitary Site plan": "b1acce0e-9fc8-4ee5-87ff-e257d4eaa490",
  "Building Sanitary Topographical data with contour": "c459a705-ae8a-4a4d-8861-8710f0ded940",
  "Building Electrical Details drawings": "d4bf16ab-b62d-489e-8969-30de655895f3",
  "Building Electrical Design report": "c1934e96-b234-47c2-ada8-0798b57fe1e0",
  "Building Electrical Site plan": "b79d8846-bab6-4da3-8b7c-ae1bf8f8bec3",
  "Building Electrical Topographical data with contour": "80a4d5f9-96a5-4947-90d9-64744004d8ff",
  "Building Mechanical Details drawings": "a1617de9-9a45-437f-87ba-a1332d49aa18",
  "Building Mechanical Design report": "fbaee5b0-767a-4bba-95d0-272d5f307bf0",
  "Building Mechanical Site plan": "34622329-1d32-47b9-adf9-e52486b37571", 
  "Building Site Road and Fence": "59a5635f-b4f9-460d-a51a-75d97fee9608",
  "Building Site Landscape Compound": "61bfb27a-251a-4aee-82c4-eac204711f5b",
  "Building Site Sanitary Works": "d2b7713d-284a-4c50-9617-8399bce4b7a1",
  "Building Site Electrical Works": "da5a3b9b-ef62-4c96-9b6b-7d13bef64148",
  //"Building Site Software results": "7b8a12ee-165d-4dc6-b844-fd5724cf442f",
  "Building Site Details design": "73bc11c0-6144-4783-9ece-deceb65a2826",
  "Building Bill of quantity specification": "72af4b2b-7cdf-4cb9-a613-324feaa2e2bf",
  "Building Take off Sheets": "1737a8e8-ee7b-494c-a934-774f12f8e701",
  "Building Approved Design Document": "9b5d3e42-0335-4fa0-8664-6e264e31beec",
  "Building Standard Bid Document": "84ca0009-8373-4059-b4f0-303becb65500",
  "Building DB Projects": "2288df8d-56ec-45aa-a6cd-787031b15787",
  "Building Engineering Estimation": "2e88444a-8587-4c02-9d1b-f8bf3836ac34",
  "Transport and Communication Detail Engineering Design Report": "accf1924-efb9-4d07-a56f-c54c6a7ed28e",
  "Transport and Communication Surveying Data": "cfa503c5-229b-4484-9aa5-c0fef74764d8",
  "Transport Communication Feasibility study Report": "be2c6849-2463-4015-bdad-5c1d273d5e3e",
  "Transport Communication Route Selection Report": "34dda254-7997-4f75-b118-cfbebe8f4203",
  "Transport Communication Resettlement action plan": "20b31015-49ab-4de1-98b0-96ac18ce96d4",
  "Transport Communication Site Investigation Report": "21d6b85e-76eb-4cac-97eb-9a6199bca959",
  "Transport Communication Geotechnical Design Report": "bf48dcd5-c753-43ef-926b-a203549c7949",
  "Transport Communication Geometric Design Report": "b6f5207b-5d8f-482a-a07e-091887afd97d",
  "Transport Communication Pavement Design Report": "102ca7a3-fe2e-4723-9c1e-85e75c8f4a26",
  "Transport Communication Drainage Design Report": "26ed1401-71ad-4067-aa41-893c238307e3",
  "Transport Communication Bridge Design Report": "12eff403-b4c4-4d9b-ad93-764fc8969177",
  "Transport Communication Standard Safety and Environmental Procedures report": "b40c513d-0c5c-4ce3-802b-f91d3554dada",
  "Transport Communication Details drawings": "3b4c2551-9e01-4848-b2f5-f73023b625bb",
  "Transport Communication Bill of Quantities": "f176cc40-1630-49cc-b632-0c5287a041af",
  "Transport Communication Standard Bid Documents": "a545dae5-e689-4b1c-bde3-bda093daf202",
  "Water Supply letter": "a57ac793-2d26-4b39-bcba-f1f4ba30c54d",
  "Water Supply Standard Bid Document": "db39a6a7-4fbf-49ec-8c54-9a03e8b5d744",
  "Water Supply Design report": "cd9767da-db1b-400a-9521-b1f5f861663a",
  "Water Supply Technical Specifications and Bill of quantity": "67b9ec9a-4681-44d8-8c45-aaeb90df7ecb",
  "Water Supply Engineering Estimation": "5f122064-eee5-41e9-9505-23d7d08cfbcd",
  "Water Supply Environmental and Social Impact Assessments": "a7be12ab-a37e-4d73-b7d3-e07526809c85",
  "Water Supply Operation and Maintenance Manuals": "fa0365a7-0ceb-44b4-90f8-22a38074847a",
  "Water Supply Design Drawings": "4b8e28fe-383b-4de4-b9fb-bc2edfa4a84e",
  "Irrigation letter": "788b1b73-92b3-4e5b-9f93-7d146df40063",
  "Irrigation Engineering estimation": "aea0e37e-ea3f-40c5-ba93-d1a2be9c1823",
  "Irrigation Initiation and Planning Docs": "4b35c1c1-d418-402d-8774-f71c3f0b3ad2",
  "Irrigation Impact Assessments": "951e96a5-7809-419a-a561-0c9c55934352",
  "Irrigation Standard Bid Document": "abb6735c-393a-4c2e-8ee5-8de26583ca10",
  "Irrigation O&M Manuals": "0146fd09-7f60-430d-85b3-f924340804ac",
  "Irrigation Design Reports": "ab873e8d-08c8-4fae-a69e-c810c1f1aeeb",
  "Irrigation Bill Of Quantity": "5d02f8c5-0e60-41f0-b8fa-cd997c9549d7",
  "Irrigation Design Drawings": "4afa0a16-08f5-4725-beec-1dff48d4f2d4",
  "Waste Water letter": "f7e7cd1b-b812-468a-9259-ceb5bfe1e90a",
  "Waste Water TOR": "f2ae0646-995f-43fe-81ba-91e7e436c052",
  "Waste Water Site and Environmental Studies": "afbaadd9-020f-4f11-8bb2-67ce50bde102",
  "Waste Water Plant specs": "e08ba51a-c0f7-4918-ae50-fa8611d12de5",
  "Waste Water Standard Bid Document": "5320455e-aa19-48d4-9ef7-b0de6280b118",
  "Waste Water Bill Of Quantity": "fdb93997-dcee-4ca5-ab61-37eded243a1f",
  "Waste Water Design Drawings": "0f6ee369-2478-467f-ae32-288ca34c094f",
  "Waste Water Operational manual": "a597d10d-5995-44f4-b849-1cbb3de644c5",
  "Energy letter": "cdfd7e32-73c0-4e86-be9f-1d6380b92818",
  "Energy Planning and Preliminary Studies": "d1e2c842-312d-4a8e-a973-0d97891526af",
  "Energy Detailed Design Docs": "5f7a94f7-01fa-4f3e-9450-28fe3d7e3029",
  "Energy Bill Of Quantity": "623fc17a-6444-41ca-b257-e95ac7f573b4",
  "Energy Standard Bid Document": "f9a879ba-b7c4-4cc1-a1c7-666391f5b5f9",
  "Energy Monitoring Plans": "c5af7a40-2bfe-4213-a7e3-1fd149797bbe",
  "Energy Risk Assessments": "a470aaac-116a-4b06-ab6d-2fbb31e9d7fc",
  "Energy O&M Manuals": "4adc68a0-44b0-4afd-b8c2-ee948c8895b8",
  "Dam letter": "b40615cb-d4c1-4974-9cd1-7b207b677940",
  "Dam Planning and feasibility study document": "a08f907f-5dc3-416d-a545-8265cccb2ec3",
  "Dam Environmental Impact assessment": "192b4a64-5968-4821-8d3f-aa3873bd8c08",
  "Dam Design report documents": "ad5f130a-098f-4150-a1c3-badcb6235293",
  "Dam Specification and Bill of Quantity": "c0ce37c2-1b0e-4dd3-9637-336e8cb7b6d9",
  "Dam Standard Bid Document": "dc7fe9d0-0f51-4958-904c-9f35b28c19b7",
  "Dam Risk assessment document": "3409e044-c010-4d07-9751-59a894fa00bf",
  "Dam Operation and Maintenance manual": "3593922e-fa46-4f5c-ac5d-bf918782f291",
  "Dam Drawing documents": "0783e8ec-7cef-4a49-a751-0f61315c432f",
  "Dam Engineering estimation": "b2d2d0ef-1e5f-4fa7-9db3-a1f8f8b1546b",
  "Permit Letter from the Federal Public Procurement and Property Administration": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "Cost Breakdown Submission": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
  "Current Construction Price Reference": "c3d4e5f6-g7h8-9012-cdef-345678901234",
  "Verification of Local Suppliers": "d4e5f6g7-h8i9-0123-defg-456789012345",
  "labor hourly price": "e5f6g7h8-i9j0-1234-efgh-567890123456",
  "Equipment hourly price": "f6g7h8i9-j0k1-2345-fghi-678901234567",
  "Terms of Reference (TOR)": "g7h8i9j0-k1l2-3456-ghij-789012345678",
  "Particular specifications": "h8i9j0k1-l2m3-4567-hijk-890123456789",
  "Contract document (SBD) for DB, DBO, EPC": "i9j0k1l2-m3n4-5678-ijkl-901234567890",
  "Bill of Quantity (BOQ)- optional": "j0k1l2m3-n4o5-6789-jklm-012345678901",
  "Drawings- optional": "k1l2m3n4-o5p6-7890-klmn-123456789012",
  "Design by Others Letter": "e07663a7-8173-4911-a1ac-6d5cc460a1a2",
  "Design by others Special work( consultant SBD)": "3690f546-5b19-49c2-b667-388a944497d0",
  "Design by Other DC Review": "d4ab00c8-ad61-432e-a56f-f09ca504ab90",
  "Design by Other Price escalation": "53f5c76b-6c9e-454a-befe-1394a035c5eb",


};

export const categories = {
  building: {
    label: "Building",
    groups: {
      "Design Review": {
        subcategories: {
          "Architectural Design": [
            "Architectural Details drawing",
            "Architectural 3D Model",
            "Architectural Design report",
            "Architectural Site plan and Work",
            "Architectural Topographical data with contour",
          ],
          "Structural Design": [
            "Building Structural analysis",
            "Building Details Structural drawings",
            "Building Structural Design report (Statical Report)",
            "Building Structural Geotechnical report",
          ],
          "Sanitary Design": [
            "Building Details Sanitary drawings",
            "Building Sanitary Design report",
            "Building Sanitary Site plan",
            "Building Sanitary Topographical data with contour",
          ],
          "Electrical Design": [
            "Building Electrical Details drawings",
            "Building Electrical Design report",
            "Building Electrical Site plan",
            "Building Electrical Topographical data with contour",
          ],
          "Mechanical Design": [
            "Building Mechanical Details drawings",
            "Building Mechanical Design report",
            "Building Mechanical Site plan",
          ],
          "Site Works": [
            "Building Site Road and Fence",
            "Building Site Landscape Compound",
            "Building Site Sanitary Works",
            "Building Site Electrical Works",
            //"Building Site Software results",
            "Building Site Details design",
          ],
          "BOQ and Specs": [
            "Building Bill of quantity specification",
            "Building Take off Sheets",
            "Building Approved Design Document",
          ],
          "SBD": ["Building Standard Bid Document"],
          "Others": ["Building DB Projects", "Building Engineering Estimation"],
        },
      },
      "Cost Approval (Fixed price)": {
        subcategories: {
          "Cost Approval (Fixed price)": [
            "Permit Letter from the Federal Public Procurement and Property Administration",
            "Cost Breakdown Submission",
            "Current Construction Price Reference",
            "Verification of Local Suppliers",
            "labor hourly price",
            "Equipment hourly price",
          ],
        },
      },
      "Design Build projects": {
        subcategories: {
          "Design Build projects": [
            "Terms of Reference (TOR)",
            "Particular specifications",
            "Contract document (SBD) for DB, DBO, EPC",
            "Bill of Quantity (BOQ)- optional",
            "Drawings- optional",
          ],
        },
        
      },
      "Letter":{
      subcategories: {
          "Building Letter": [
            "Building Design Review Request Letter",],
        },
      }
    },
  },
  transport: {
    label: "Transport & Communication",
    groups: {
      "Design Review": {
        subcategories: {
          "General Requirements": [
            "Transport Communication Feasibility study Report",
            "Transport Communication Route Selection Report",
            "Transport Communication Resettlement action plan",
            "Transport Communication Site Investigation Report",
            "Transport Communication Geotechnical Design Report",
            "Transport Communication Geometric Design Report",
            "Transport Communication Pavement Design Report",
            "Transport Communication Drainage Design Report",
            "Transport Communication Bridge Design Report",
            "Transport Communication Standard Safety and Environmental Procedures report",
            "Transport Communication Details drawings",
            "Transport Communication Bill of Quantities",
            "Transport Communication Standard Bid Documents",
          ],
        },
      },
      "Cost Approval (Fixed price)": {
        subcategories: {
          "Cost Approval (Fixed price)": [
            "Permit Letter from the Federal Public Procurement and Property Administration",
            "Cost Breakdown Submission",
            "Current Construction Price Reference",
            "Verification of Local Suppliers",
            "labor hourly price",
            "Equipment hourly price",
          ],
        },
      },
      "Design Build projects": {
        subcategories: {
          "Design Build projects": [
            "Terms of Reference (TOR)",
            "Particular specifications",
            "Contract document (SBD) for DB, DBO, EPC",
            "Bill of Quantity (BOQ)- optional",
            "Drawings- optional",
            
          ],
        },
      },
       "Letter":{
      subcategories: {
          "Transport Communication": [
            "Transport Communication Design Review Request Letter",],
        },
      }
      // You can add other groups here later, e.g., "Environmental", "Safety"
    },
  },
  water: {
    label: "Water & Energy",
    groups: {
      "Design Review": {
        subcategories: {
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
            "Waste Water Site and Environmental Studies",
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
            "Dam letter",
            "Dam Planning and feasibility study document",
            "Dam Environmental Impact assessment",
            "Dam Design report documents",
            "Dam Specification and Bill of Quantity",
            "Dam Standard Bid Document",
            "Dam Risk assessment document",
            "Dam Operation and Maintenance manual",
            "Dam Drawing documents",
            "Dam Engineering estimation",
          ],
        },
      },
      "Cost Approval (Fixed price)": {
        subcategories: {
          "Cost Approval (Fixed price)": [
            "Permit Letter from the Federal Public Procurement and Property Administration",
            "Cost Breakdown Submission",
            "Current Construction Price Reference",
            "Verification of Local Suppliers",
            "labor hourly price",
            "Equipment hourly price",
          ],
        },
      },
      "Design Build projects": {
        subcategories: {
          "Design Build projects": [
            "Terms of Reference (TOR)",
            "Particular specifications",
            "Contract document (SBD) for DB, DBO, EPC",
            "Bill of Quantity (BOQ)- optional",
            "Drawings- optional",
          ],
        },
      },

    },
  },
  others: {
    label: "Others",
    groups: {
      "Design Review": {
        subcategories: {
          "Cost Approval (Fixed price)": [
            "Design by Others Letter",
            "Design by others Special work( consultant SBD)",
            "Design by Other DC Review",
            "Design by Other Price escalation",
          ],
        },
      },
    },
  },
};

export const folderMap = {
  building: 'Building Construction', // Changed from 'Building Design'
  water: 'Water and Irrigation',    // Changed from 'Water and Energy'
  transport: 'Road Construction',    // Changed from 'Transportation and Communication'
  others: 'Others',
};

export type DocumentCategory = keyof typeof documentCategoryIds;
export type ProjectCategory = keyof typeof categories;
function RouteComponent() {
  return <div>Hello "/dms/_main/documents/DocumentDetail"!</div>;
}

export const Route = createFileRoute(
  "/project-owner/_main/documentData"
)({
  component: RouteComponent,
});
