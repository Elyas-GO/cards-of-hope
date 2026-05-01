import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronRight,
  Pencil,
  Loader2,
  CheckCircle,
  XCircle,
  Mail,
  FileText,
  ChevronDown,
  Eye,
  Upload,
  Trash2,
  CloudUpload,
} from "lucide-react";
import { API_GATEWAY, PRMS_endpoints, DMS_endpoints } from "@/constants/url";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Card,
  Label,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  toast,
  LoadingSpinner,
  DropdownMenuTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AccordionContent,
} from "@/components/ui";
import axios from "axios";
import { useProtected } from "@/hooks/useProtected";
import { useState, useEffect, useCallback, useRef } from "react";
import { format, parse, isValid } from "date-fns";
import { documentCategoryIds, categories } from "./documentData";
import { getFileTypeHint } from "./field-placeholder";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { mandatoryDocumentsByTab } from "@/utils/mandatoryDocuments";

export const Route = createFileRoute("/project-owner/_main/design-documents")({
  component: DesignDocumentPage,
});

const BASE_URL = `${API_GATEWAY}${DMS_endpoints}/document`;

// Combined set of all mandatory document names (for red asterisk)
const allMandatoryDocumentNames = new Set(
  Object.values(mandatoryDocumentsByTab).flatMap((tab: any) =>
    Object.values(tab).flat()
  )
);

type ProjectInfo = {
  id?: string;
  project_name?: string;
  project_id?: string;
  feasibility_approved_date?: string;
  approved_feasibility_attachment?: string;
  approved_budget_amount?: string;
  approved_budget_date?: string;
  approved_budget_attachment?: string;
  project_type?: string;
  project_category?: string;
  createdAt?: string;
};

type DocumentStatus = "draft" | "review" | "active" | "archive";

interface DocumentVersion {
  document_version_id: string;
  version_number: number;
  file_path: string;
  file_name: string;
  uploaded_date: string;
  status: DocumentStatus;
}

interface ProjectDocument {
  document: {
    id: string;
    document_name: string;
    document_description?: string;
    project_id: string;
    category_id: string;
    uploaded_date: string;
    category_name: string | null;
  };
  latest_version?: DocumentVersion & {
    hasLetter?: boolean;
    letterContent?: string;
    hasRejectionLetter?: boolean;
  };
}

interface Letter {
  letter_id: string;
  subject: string;
  body: string;
  createdAt: string;
  recipient_id: string;
  reference_number: string | null;
  sent_date: string;
}

const columnHelper = createColumnHelper<ProjectInfo>();

// ------------------------------------------------------------------
// Custom File Input Component (multiple files, temp upload)
// ------------------------------------------------------------------
const CustomFileInput = ({
  id,
  className,
  onChange,
  disabled,
  files,
  isUploaded,
  documentName,
  onRemoveFile,
}: {
  id: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  files: File[] | null;
  isUploaded: boolean;
  documentName: string;
  onRemoveFile?: (index: number) => void;
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files && files.length > 0) {
      setFileNames(files.map((file) => file.name));
    } else {
      setFileNames([]);
    }
  }, [files]);

  const handleButtonClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  const buttonText =
    files && files.length > 0
      ? `Edit Files (${files.length})`
      : isUploaded
      ? "Edit Files"
      : "Browse";

  const displayText =
    files && files.length > 0
      ? `${files.length} file(s) selected`
      : isUploaded
      ? "Edit Files"
      : "Choose Files";

  return (
    <div className="relative w-full">
      <Input
        id={id}
        ref={fileInputRef}
        type="file"
        multiple
        required
        disabled={disabled}
        className={`${className} hidden`}
        onChange={onChange}
      />
      <div
        onClick={handleButtonClick}
        className={`flex items-center justify-between px-4 py-3 border border-input rounded-md bg-background ${
          disabled ? "opacity-50" : "cursor-pointer"
        } w-full`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Upload className="h-4 w-4 flex-shrink-0" />
          <span
            className="text-sm truncate"
            title={
              fileNames.join(", ") ||
              (isUploaded ? "Edit Files" : "Choose Files")
            }
          >
            {displayText}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs flex-shrink-0"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
        >
          {buttonText}
        </Button>
      </div>

      {files && files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded"
            >
              <span className="truncate max-w-[200px]" title={file.name}>
                {file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile?.(index);
                }}
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-1 text-xs text-muted-foreground">
        {getFileTypeHint(documentName)} (Multiple files allowed)
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------
function DesignDocumentPage() {
  const queryClient = useQueryClient();
  const api = useProtected();
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    project_name: "",
    feasibility_approved_date: "",
    approved_feasibility_attachment: null as File | string | null,
    approved_budget_amount: "",
    approved_budget_date: "",
    approved_budget_attachment: null as File | string | null,
    project_type: "",
    project_category: "",
  });
  const [activeTab, setActiveTab] = useState<
    "building" | "water" | "transport" | "others"
  >("building");
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, "idle" | "uploading" | "success" | "error">
  >({});
  const [fileInputs, setFileInputs] = useState<Record<string, File[] | null>>(
    {}
  );
  const [documentData, setDocumentData] = useState<
    Record<string, ProjectDocument | null>
  >({});
  const [fetchingDocuments, setFetchingDocuments] = useState<
    Record<string, boolean>
  >({});
  const [fetchedDocuments, setFetchedDocuments] = useState<
    Record<string, boolean>
  >({});
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<{
    content: string;
    documentVersionId: string;
    documentName: string;
  } | null>(null);
  const [letterLoading, setLetterLoading] = useState(false);
  const [projectLetters, setProjectLetters] = useState<
    Record<string, Letter[]>
  >({});
  const [fetchingLetters, setFetchingLetters] = useState<
    Record<string, boolean>
  >({});
  const [uploadCounts, setUploadCounts] = useState<
    Record<
      string,
      {
        project: { uploaded: number; total: number };
        subcategories: Record<string, { uploaded: number; total: number }>;
      }
    >
  >({});
  const [approvalStatus, setApprovalStatus] = useState<Record<string, boolean>>(
    {}
  );
  const [submittingTab, setSubmittingTab] = useState<string | null>(null);
  const [submittingSubAccordion, setSubmittingSubAccordion] = useState<
    string | null
  >(null);
  const [tempFiles, setTempFiles] = useState<Record<string, File[] | null>>({});
  const [uploadedTempPaths, setUploadedTempPaths] = useState<
    Record<string, string[]>
  >({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects-info"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_GATEWAY}${PRMS_endpoints}/project-info`,
        { withCredentials: true }
      );
      return response.data;
    },
  });

  // --------------------------------------------------------------
  // Helper: Check if a list of mandatory documents is completed
  // --------------------------------------------------------------
  const areMandatoryDocsCompleted = useCallback(
    (projectId: string, docNames: string[]): boolean => {
      for (const doc of docNames) {
        const categoryId = documentCategoryIds[doc];
        if (!categoryId) continue;
        const key = `${projectId}__${categoryId}__${doc}`;
        const hasUploaded = !!documentData[key]?.latest_version;
        const hasStaged = !!uploadedTempPaths[key]?.length;
        if (!hasUploaded && !hasStaged) return false;
      }
      return true;
    },
    [documentData, uploadedTempPaths]
  );

  // --------------------------------------------------------------
  // Validation rules per tab
  // --------------------------------------------------------------
  const isBuildingRoadSubmissionAllowed = useCallback(
    (projectId: string, tab: "building" | "transport"): boolean => {
      const letterOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab[tab].letter
      );
      const designReviewOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab[tab].designReview
      );
      const costApprovalOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab[tab].costApproval
      );
      const designBuildOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab[tab].designBuild
      );
      return letterOk && (designReviewOk || (costApprovalOk && designBuildOk));
    },
    [areMandatoryDocsCompleted]
  );

  const isWaterSubAccordionAllowed = useCallback(
    (projectId: string, subAccordionName: string): boolean => {
      const subMandatory =
        mandatoryDocumentsByTab.water.subAccordions[subAccordionName] || [];
      const subCompleted = areMandatoryDocsCompleted(projectId, subMandatory);
      const costApprovalOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab.water.costApproval
      );
      const designBuildOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab.water.designBuild
      );
      const letterOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab.water.letter
      );
      const alternativeCompleted = costApprovalOk && designBuildOk && letterOk;
      return subCompleted || alternativeCompleted;
    },
    [areMandatoryDocsCompleted]
  );

  const isOthersTabAllowed = useCallback(
    (projectId: string): boolean => {
      return areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab.others.allMandatory
      );
    },
    [areMandatoryDocsCompleted]
  );

  // --------------------------------------------------------------
  // Collect keys for submission (to know which staged files to move)
  // --------------------------------------------------------------
  const getKeysForBuildingRoadSubmission = useCallback(
    (projectId: string, tab: "building" | "transport"): string[] => {
      const keys: string[] = [];
      // Always include letter
      mandatoryDocumentsByTab[tab].letter.forEach((doc) => {
        const catId = documentCategoryIds[doc];
        if (catId) keys.push(`${projectId}__${catId}__${doc}`);
      });

      if (
        areMandatoryDocsCompleted(projectId, mandatoryDocumentsByTab[tab].designReview)
      ) {
        mandatoryDocumentsByTab[tab].designReview.forEach((doc) => {
          const catId = documentCategoryIds[doc];
          if (catId) keys.push(`${projectId}__${catId}__${doc}`);
        });
      } else if (
        areMandatoryDocsCompleted(projectId, mandatoryDocumentsByTab[tab].costApproval) &&
        areMandatoryDocsCompleted(projectId, mandatoryDocumentsByTab[tab].designBuild)
      ) {
        mandatoryDocumentsByTab[tab].costApproval.forEach((doc) => {
          const catId = documentCategoryIds[doc];
          if (catId) keys.push(`${projectId}__${catId}__${doc}`);
        });
        mandatoryDocumentsByTab[tab].designBuild.forEach((doc) => {
          const catId = documentCategoryIds[doc];
          if (catId) keys.push(`${projectId}__${catId}__${doc}`);
        });
      }
      return keys;
    },
    [areMandatoryDocsCompleted]
  );

  const getKeysForWaterSubmission = useCallback(
    (projectId: string, subAccordionName: string): string[] => {
      const keys: string[] = [];
      const subMandatory =
        mandatoryDocumentsByTab.water.subAccordions[subAccordionName] || [];
      const subCompleted = areMandatoryDocsCompleted(projectId, subMandatory);
      const costApprovalOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab.water.costApproval
      );
      const designBuildOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab.water.designBuild
      );
      const letterOk = areMandatoryDocsCompleted(
        projectId,
        mandatoryDocumentsByTab.water.letter
      );

      if (subCompleted) {
        subMandatory.forEach((doc) => {
          const catId = documentCategoryIds[doc];
          if (catId) keys.push(`${projectId}__${catId}__${doc}`);
        });
      } else if (costApprovalOk && designBuildOk && letterOk) {
        mandatoryDocumentsByTab.water.costApproval.forEach((doc) => {
          const catId = documentCategoryIds[doc];
          if (catId) keys.push(`${projectId}__${catId}__${doc}`);
        });
        mandatoryDocumentsByTab.water.designBuild.forEach((doc) => {
          const catId = documentCategoryIds[doc];
          if (catId) keys.push(`${projectId}__${catId}__${doc}`);
        });
        mandatoryDocumentsByTab.water.letter.forEach((doc) => {
          const catId = documentCategoryIds[doc];
          if (catId) keys.push(`${projectId}__${catId}__${doc}`);
        });
      }
      return keys;
    },
    [areMandatoryDocsCompleted]
  );

  const getKeysForOthersSubmission = useCallback(
    (projectId: string): string[] => {
      return mandatoryDocumentsByTab.others.allMandatory
        .map((doc) => {
          const catId = documentCategoryIds[doc];
          return `${projectId}__${catId}__${doc}`;
        })
        .filter((k) => k.includes("__"));
    },
    []
  );

  // --------------------------------------------------------------
  // Submit: move temp files to final location
  // --------------------------------------------------------------
  const submitDocuments = async (
    projectId: string,
    keysToSubmit: string[],
    submissionType: string
  ) => {
    const tempPaths: string[] = [];
    for (const key of keysToSubmit) {
      if (uploadedTempPaths[key]) {
        tempPaths.push(...uploadedTempPaths[key]);
      }
    }
    if (tempPaths.length === 0) {
      toast({
        title: "No files to submit",
        description: "No staged files found.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post(
        `${API_GATEWAY}${DMS_endpoints}/move-temp-to-final`,
        {
          project_id: projectId,
          submission_type: submissionType,
          temp_file_paths: tempPaths,
        }
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Documents have been submitted for approval.",
        });
        // Clear staged files for those keys
        const newTempPaths = { ...uploadedTempPaths };
        for (const key of keysToSubmit) {
          delete newTempPaths[key];
        }
        setUploadedTempPaths(newTempPaths);
        // Refetch documents to update UI
        for (const key of keysToSubmit) {
          const [, catId, docName] = key.split("__");
          if (catId && docName) {
            await fetchDocument(projectId, catId, docName);
          }
        }
      } else {
        throw new Error(response.data.error || "Submission failed");
      }
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // --------------------------------------------------------------
  // Upload to temp endpoint (replaces previous direct upload)
  // --------------------------------------------------------------
  const handleUploadMultipleFiles = async (
    files: File[],
    documentName: string,
    key: string,
    projectId: string,
    folderProjectId: string
  ) => {
    if (!files.length) return;
    if (!validateMultipleFileTypes(files, documentName)) return;

    setUploadStatus((prev) => ({ ...prev, [key]: "uploading" }));
    try {
      const categoryId = documentCategoryIds[documentName];
      const formData = new FormData();
      formData.append("projectId", folderProjectId);
      formData.append("tab", activeTab);
      formData.append("categoryId", categoryId);
      files.forEach((file) => formData.append("files", file));

      const response = await api.post(
        `${API_GATEWAY}${DMS_endpoints}/upload-temp`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          params: { project_id: projectId },
        }
      );

      if (response.data.success) {
        setUploadedTempPaths((prev) => ({
          ...prev,
          [key]: response.data.filePaths,
        }));
        setTempFiles((prev) => ({ ...prev, [key]: files }));
        setUploadStatus((prev) => ({ ...prev, [key]: "success" }));
        toast({ title: "Success", description: "Files staged temporarily." });
      } else {
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // --------------------------------------------------------------
  // Existing functions (fetchDocument, checkDocumentApproval, etc.)
  // --------------------------------------------------------------
  const checkDocumentApproval = async (
    documentVersionId: string
  ): Promise<boolean> => {
    try {
      const response = await api.get(
        `${API_GATEWAY}${DMS_endpoints}/assignapprover/assignments/${documentVersionId}`
      );
      return (
        response.data.success &&
        response.data.data &&
        response.data.data.length > 0
      );
    } catch (error) {
      console.error("Error checking document approval:", error);
      return false;
    }
  };

  const validateFileType = (file: File, documentName: string): boolean => {
    const fileTypeHint = getFileTypeHint(documentName).toLowerCase();
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension) {
      toast({
        title: "Invalid File",
        description: "File has no extension",
        variant: "destructive",
      });
      return false;
    }
    const validExtensionsMatch = fileTypeHint.match(/^[^()]+/);
    if (!validExtensionsMatch) {
      toast({
        title: "Invalid File Type",
        description: `No valid file types defined for ${documentName}`,
        variant: "destructive",
      });
      return false;
    }
    const validExtensions = validExtensionsMatch[0]
      .split(",")
      .map((ext) => ext.trim().toLowerCase())
      .filter((ext) => ext);
    if (!validExtensions.includes(extension)) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a ${validExtensions.join(", ")} file for ${documentName}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateMultipleFileTypes = (
    files: File[],
    documentName: string
  ): boolean => {
    const fileTypeHint = getFileTypeHint(documentName).toLowerCase();
    const validExtensionsMatch = fileTypeHint.match(/^[^()]+/);
    if (!validExtensionsMatch) {
      toast({
        title: "Invalid File Type",
        description: `No valid file types defined for ${documentName}`,
        variant: "destructive",
      });
      return false;
    }
    const validExtensions = validExtensionsMatch[0]
      .split(",")
      .map((ext) => ext.trim().toLowerCase())
      .filter((ext) => ext);
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension) {
        toast({
          title: "Invalid File",
          description: `File "${file.name}" has no extension`,
          variant: "destructive",
        });
        return false;
      }
      if (!validExtensions.includes(extension)) {
        toast({
          title: "Invalid File Type",
          description: `File "${file.name}" is not a valid type for ${documentName}. Valid types: ${validExtensions.join(", ")}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const table = useReactTable({
    data: data?.data?.projects || [],
    columns: [
      columnHelper.display({
        id: "expand",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => row.toggleExpanded()}
            className="h-8 w-8 p-0"
          >
            <ChevronRight
              className={`h-4 w-4 ${row.getIsExpanded() ? "rotate-90" : ""}`}
            />
          </Button>
        ),
      }),
      columnHelper.accessor("project_id", { header: "Project ID" }),
      columnHelper.accessor("project_name", {
        header: "Project Name",
        cell: (info) => {
          const projectId = info.row.original.project_id;
          const counts = uploadCounts[projectId]?.project || {
            uploaded: 0,
            total: 0,
          };
          return (
            <div className="flex items-center gap-2">
              <span>{info.getValue()}</span>
              <span className="text-sm text-gray-500">
                ({counts.uploaded}/{counts.total})
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("project_type", { header: "Project Type" }),
      columnHelper.accessor("feasibility_approved_date", {
        header: "Feasibility Date",
        cell: (info) => info.getValue()?.split("T")[0],
      }),
      columnHelper.accessor("approved_budget_amount", {
        header: "Approved Budget",
      }),
      columnHelper.accessor("createdAt", {
        header: "Registration Date",
        cell: (info) => info.getValue()?.split("T")[0],
      }),
      columnHelper.display({
        id: "letter",
        header: "Letter",
        cell: ({ row }) => {
          const projectId = row.original.project_id || "";
          const hasLetters = projectLetters[projectId]?.length > 0;
          return hasLetters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedProject(row.original);
                setIsLetterModalOpen(true);
              }}
              title="View letters"
            >
              <Mail className="h-4 w-4" />
            </Button>
          ) : null;
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProject(row.original);
                  setEditFormData({
                    project_name: row.original.project_name || "",
                    feasibility_approved_date:
                      row.original.feasibility_approved_date || "",
                    approved_feasibility_attachment:
                      row.original.approved_feasibility_attachment || null,
                    approved_budget_amount:
                      row.original.approved_budget_amount || "",
                    approved_budget_date:
                      row.original.approved_budget_date || "",
                    approved_budget_attachment:
                      row.original.approved_budget_attachment || null,
                    project_type: row.original.project_type || "",
                    project_category: row.original.project_category || "",
                  });
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProject(row.original);
                  setIsDeleteModalOpen(true);
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    state: { globalFilter, pagination, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const fetchLetter = async (
    documentVersionId: string,
    documentName: string
  ) => {
    if (!documentVersionId) {
      toast({
        title: "Error",
        description: "Invalid document version ID",
        variant: "destructive",
      });
      return;
    }
    setLetterLoading(true);
    try {
      const response = await api.get(
        `${API_GATEWAY}${DMS_endpoints}/letter/by-version/${documentVersionId}`
      );
      if (response.data.success && response.data.letter) {
        setSelectedLetter({
          content: response.data.letter.body,
          documentVersionId,
          documentName,
        });
        setIsLetterModalOpen(true);
      } else {
        toast({
          title: "Info",
          description:
            response.data.message || "No letter found for this version",
          className: "bg-green-100 border-green-500 text-green-900",
        });
      }
    } catch (error: any) {
      console.error("Error fetching letter:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch letter",
        variant: "destructive",
      });
    } finally {
      setLetterLoading(false);
    }
  };

  const fetchProjectLetters = async (projectId: string) => {
    if (!projectId || fetchingLetters[projectId]) return;
    setFetchingLetters((prev) => ({ ...prev, [projectId]: true }));
    try {
      const response = await api.get(
        `${API_GATEWAY}${DMS_endpoints}/letter/recipient/${projectId}`
      );
      if (response.data.success && Array.isArray(response.data.letters)) {
        const letters = response.data.letters.map((letter: any) => ({
          letter_id:
            letter.letter_id ||
            letter.id ||
            `fallback-${Math.random().toString(36).substring(2, 15)}`,
          subject: letter.subject || "No Subject",
          body: letter.body || "",
          createdAt:
            letter.created_at || letter.createdAt || new Date().toISOString(),
          recipient_id: letter.recipient_id || "",
          reference_number: letter.reference_number || null,
          sent_date:
            letter.sent_date || letter.createdAt || new Date().toISOString(),
        }));
        setProjectLetters((prev) => ({ ...prev, [projectId]: letters }));
      } else {
        setProjectLetters((prev) => ({ ...prev, [projectId]: [] }));
      }
    } catch (error: any) {
      console.error("Error fetching project letters:", error);
      setProjectLetters((prev) => ({ ...prev, [projectId]: [] }));
      if (error.response?.status !== 404) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to fetch letters for project",
          variant: "destructive",
        });
      }
    } finally {
      setFetchingLetters((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const initializeUploadCounts = useCallback((projects: ProjectInfo[]) => {
    const initialCounts: Record<
      string,
      {
        project: { uploaded: number; total: number };
        subcategories: Record<string, { uploaded: number; total: number }>;
      }
    > = {};
    projects.forEach((project) => {
      const projectId = project.project_id || "";
      let projectTotal = 0;
      const subcategoryCounts: Record<
        string,
        { uploaded: number; total: number }
      > = {};
      (["building", "water", "transport", "others"] as const).forEach(
        (category) => {
          const subcategories = categories[category]?.subcategories || {};
          Object.entries(subcategories).forEach(([sub, documents]) => {
            const subTotal = documents.length;
            subcategoryCounts[`${category}_${sub}`] = {
              uploaded: 0,
              total: subTotal,
            };
            projectTotal += subTotal;
          });
        }
      );
      initialCounts[projectId] = {
        project: { uploaded: 0, total: projectTotal },
        subcategories: subcategoryCounts,
      };
    });
    setUploadCounts(initialCounts);
  }, []);

  const updateUploadCounts = useCallback(
    (
      projectId: string,
      updatedDocumentData: Record<string, ProjectDocument | null> = documentData
    ) => {
      const allCategories = [
        "building",
        "water",
        "transport",
        "others",
      ] as const;
      let projectUploaded = 0;
      let projectTotal = 0;
      const subcategoryCounts: Record<
        string,
        { uploaded: number; total: number }
      > = {};
      allCategories.forEach((category) => {
        const subcategories = categories[category]?.subcategories || {};
        Object.entries(subcategories).forEach(([sub, documents]) => {
          let subUploaded = 0;
          const subTotal = documents.length;
          documents.forEach((doc) => {
            const categoryId = documentCategoryIds[doc];
            if (!categoryId) {
              console.error(`No categoryId found for document: ${doc}`);
              return;
            }
            const key = `${projectId}__${categoryId}__${doc}`;
            if (updatedDocumentData[key]?.latest_version) {
              subUploaded += 1;
            }
          });
          subcategoryCounts[`${category}_${sub}`] = {
            uploaded: subUploaded,
            total: subTotal,
          };
          projectUploaded += subUploaded;
          projectTotal += subTotal;
        });
      });
      setUploadCounts((prev) => ({
        ...prev,
        [projectId]: {
          project: { uploaded: projectUploaded, total: projectTotal },
          subcategories: subcategoryCounts,
        },
      }));
    },
    [documentData]
  );

  const fetchDocument = async (
    projectId: string,
    categoryId: string,
    docName: string
  ) => {
    const key = `${projectId}__${categoryId}__${docName}`;
    if (!projectId || !categoryId || fetchingDocuments[key]) return;
    setFetchingDocuments((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await api.get(`${BASE_URL}/getprojectcategorydocument`, {
        params: { project_id: projectId, category_id: categoryId },
      });
      if (!response.data.success || !response.data.documentInfo) {
        setDocumentData((prev) => {
          const newData = { ...prev, [key]: null };
          updateUploadCounts(projectId, newData);
          return newData;
        });
        setApprovalStatus((prev) => ({ ...prev, [key]: false }));
        return;
      }
      const docVersionId = response.data.documentInfo.latest_version?.id;
      if (!docVersionId) {
        setDocumentData((prev) => {
          const newData = { ...prev, [key]: response.data.documentInfo };
          updateUploadCounts(projectId, newData);
          return newData;
        });
        setApprovalStatus((prev) => ({ ...prev, [key]: false }));
        return;
      }
      const isUnderApproval = await checkDocumentApproval(docVersionId);
      setApprovalStatus((prev) => ({ ...prev, [key]: isUnderApproval }));
      try {
        const letterResponse = await api.get(
          `${API_GATEWAY}${DMS_endpoints}/letter/by-version/${docVersionId}`
        );
        const hasRejectionLetter =
          letterResponse.data.success &&
          letterResponse.data.letter?.subject === "Rejection";
        setDocumentData((prev) => {
          const newData = {
            ...prev,
            [key]: {
              ...response.data.documentInfo,
              latest_version: {
                ...response.data.documentInfo.latest_version,
                letterContent: letterResponse.data.success
                  ? letterResponse.data.letter?.body
                  : undefined,
                hasLetter:
                  letterResponse.data.success && !!letterResponse.data.letter,
                hasRejectionLetter,
              },
            },
          };
          updateUploadCounts(projectId, newData);
          return newData;
        });
      } catch (letterError) {
        setDocumentData((prev) => {
          const newData = {
            ...prev,
            [key]: {
              ...response.data.documentInfo,
              latest_version: {
                ...response.data.documentInfo.latest_version,
                hasRejectionLetter: false,
              },
            },
          };
          updateUploadCounts(projectId, newData);
          return newData;
        });
      }
    } catch (err) {
      console.error(`Document fetch failed for ${key}:`, err);
      setDocumentData((prev) => {
        const newData = { ...prev, [key]: null };
        updateUploadCounts(projectId, newData);
        return newData;
      });
      setApprovalStatus((prev) => ({ ...prev, [key]: false }));
    } finally {
      setFetchedDocuments((prev) => ({ ...prev, [key]: true }));
      setFetchingDocuments((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleVersionUpload = async (
    projectId: string,
    categoryId: string,
    documentName: string,
    files: File[],
    key: string
  ) => {
    // Version upload still goes directly (no temp needed, as versions are updates to existing documents)
    if (!validateMultipleFileTypes(files, documentName)) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      return;
    }
    setUploadStatus((prev) => ({ ...prev, [key]: "uploading" }));
    try {
      if (!documentData[key]) {
        await fetchDocument(projectId, categoryId, documentName);
      }
      const documentInfo = documentData[key];
      if (!documentInfo) throw new Error("Document information not found");
      if (!documentInfo.document.id) throw new Error("Document ID is missing");
      const latestVersion = documentInfo.latest_version;
      if (!latestVersion) throw new Error("Previous version information not found");
      if (!latestVersion.file_path) throw new Error("Previous file path is missing");
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("document_id", documentInfo.document.id);
        formData.append(
          "version_number",
          String(latestVersion.version_number + 1 + index)
        );
        formData.append("previousFilePath", latestVersion.file_path);
        formData.append("uploaded_by", "204ad15e-5185-40eb-8ee4-e693277aff7c");
        formData.append("tab", activeTab);
        formData.append("file_index", String(index));
        const response = await api.post(
          `${API_GATEWAY}${DMS_endpoints}/documentversions`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (!response.data.success) {
          throw new Error(response.data.error || `Version upload failed for ${file.name}`);
        }
        return response.data;
      });
      await Promise.all(uploadPromises);
      setUploadStatus((prev) => ({ ...prev, [key]: "success" }));
      queryClient.invalidateQueries({ queryKey: ["projectDocumentVersions", projectId] });
      setFetchedDocuments((prev) => ({ ...prev, [key]: false }));
      setDocumentData((prev) => {
        const newData = { ...prev, [key]: null };
        updateUploadCounts(projectId, newData);
        return newData;
      });
      await fetchDocument(projectId, categoryId, documentName);
      toast({
        title: "Success",
        description: `${files.length} version(s) uploaded successfully`,
        style: { background: "#22c55e", color: "white" },
      });
    } catch (err: any) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      setFetchedDocuments((prev) => ({ ...prev, [key]: true }));
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const updateDocumentMutation = useMutation({
    mutationFn: async ({
      projectId,
      folderProjectId,
      categoryId,
      files,
      title,
      description,
      tab,
    }: {
      projectId: string;
      folderProjectId: string;
      categoryId: string;
      files: File[];
      title: string;
      description: string;
      tab: string;
    }) => {
      // This is for replacing an existing document - we still use direct upload (no temp)
      const uploadPromises = files.map(async (file, index) => {
        if (!validateFileType(file, title)) {
          throw new Error(`Invalid file type for ${title} - ${file.name}`);
        }
        const formData = new FormData();
        formData.append("projectId", folderProjectId);
        formData.append("tab", tab);
        formData.append("path", "Design Document");
        formData.append("file", file);
        formData.append("title", `${title} - File ${index + 1}`);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("createdBy", "204ad15e-5185-40eb-8ee4-e693277aff7c");
        formData.append("file_index", String(index));
        const response = await api.put(
          `${BASE_URL}/projectcategorydocument`,
          formData,
          {
            params: { project_id: projectId, category_id: categoryId },
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        return response.data;
      });
      return Promise.all(uploadPromises);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projectDocumentVersions", variables.projectId] });
      setUploadStatus((prev) => ({
        ...prev,
        [`${variables.projectId}__${variables.categoryId}__${variables.title}`]: "success",
      }));
      setFetchedDocuments((prev) => ({
        ...prev,
        [`${variables.projectId}__${variables.categoryId}__${variables.title}`]: false,
      }));
      setDocumentData((prev) => {
        const newData = {
          ...prev,
          [`${variables.projectId}__${variables.categoryId}__${variables.title}`]: null,
        };
        updateUploadCounts(variables.projectId, newData);
        return newData;
      });
      fetchDocument(variables.projectId, variables.categoryId, variables.title);
      toast({
        title: "Success",
        description: `${variables.files.length} document(s) replaced successfully`,
        style: { background: "#22c55e", color: "white" },
      });
    },
    onError: (error, variables) => {
      setUploadStatus((prev) => ({
        ...prev,
        [`${variables.projectId}__${variables.categoryId}__${variables.title}`]: "error",
      }));
      setFetchedDocuments((prev) => ({
        ...prev,
        [`${variables.projectId}__${variables.categoryId}__${variables.title}`]: true,
      }));
      toast({ title: "Error", description: (error as any).response?.data?.details || (error as any).message, variant: "destructive" });
    },
  });

  const handleUpdateMultipleDocuments = async (
    projectId: string,
    folderProjectId: string,
    categoryId: string,
    documentName: string,
    files: File[] | null,
    key: string
  ) => {
    if (!files || files.length === 0) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      toast({ title: "Error", description: "No files selected for update", variant: "destructive" });
      return;
    }
    if (!validateMultipleFileTypes(files, documentName)) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      return;
    }
    const documentInfo = documentData[key];
    if (!documentInfo?.latest_version) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      toast({ title: "Error", description: "Document version information not found", variant: "destructive" });
      return;
    }
    setUploadStatus((prev) => ({ ...prev, [key]: "uploading" }));
    const isUnderApproval = await checkDocumentApproval(
      documentInfo.latest_version.document_version_id
    );
    if (isUnderApproval) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      toast({ title: "Edit Prohibited", description: "This document is under approval and cannot be edited.", variant: "destructive" });
      return;
    }
    try {
      const description =
        documentData[`${projectId}__${categoryId}__${documentName}`]
          ?.document_description || "";
      await updateDocumentMutation.mutateAsync({
        projectId,
        folderProjectId,
        categoryId,
        files,
        title: documentName,
        description,
        tab: activeTab,
      });
    } catch (err: any) {
      setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      setFetchedDocuments((prev) => ({ ...prev, [key]: true }));
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleInputChange = (key: string, fileList: FileList | null) => {
    if (!fileList) {
      setFileInputs((prev) => ({ ...prev, [key]: null }));
      return;
    }
    const filesArray = Array.from(fileList);
    if (!validateMultipleFileTypes(filesArray, key.split("__")[2])) {
      setFileInputs((prev) => ({ ...prev, [key]: null }));
      return;
    }
    setFileInputs((prev) => ({ ...prev, [key]: filesArray }));
    if (uploadStatus[key] !== "success") {
      setUploadStatus((prev) => ({ ...prev, [key]: "idle" }));
    }
  };

  const handleRemoveFile = (key: string, index: number) => {
    setFileInputs((prev) => {
      const currentFiles = prev[key];
      if (!currentFiles) return prev;
      const newFiles = [...currentFiles];
      newFiles.splice(index, 1);
      return {
        ...prev,
        [key]: newFiles.length > 0 ? newFiles : null,
      };
    });
  };

  const areAllFilesSelected = (documents: string[], projectId: string): boolean => {
    const missingDocuments = documents.filter((doc) => {
      const categoryId = documentCategoryIds[doc];
      if (!categoryId) return false;
      const key = `${projectId}__${categoryId}__${doc}`;
      return !documentData[key]?.latest_version && !fileInputs[key];
    });
    return missingDocuments.length === 0;
  };

  const updateProjectMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.put(
        `${API_GATEWAY}${PRMS_endpoints}/project-info/${selectedProject?.id}`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects-info"] });
      toast({ title: "Success", description: "Project updated successfully", style: { background: "#22c55e", color: "white" } });
      setIsEditModalOpen(false);
    },
    onError: (error: any) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        `${API_GATEWAY}${PRMS_endpoints}/project-info/${selectedProject?.id}`,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects-info"] });
      toast({ title: "Success", description: "Project deleted successfully", style: { background: "#22c55e", color: "white" } });
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  useEffect(() => {
    if (data?.data?.projects) {
      initializeUploadCounts(data.data.projects);
      data.data.projects.forEach((project: ProjectInfo) => {
        const projectId = project.project_id;
        if (projectId && !projectLetters[projectId] && !fetchingLetters[projectId]) {
          fetchProjectLetters(projectId);
        }
      });
    }
  }, [data, projectLetters, fetchingLetters, initializeUploadCounts]);

  useEffect(() => {
    const expandedRows = table.getRowModel().rows.filter((row) => row.getIsExpanded());
    expandedRows.forEach((row) => {
      const projectId = row.original.project_id || "";
      if (!projectId) return;
      (["building", "water", "transport", "others"] as const).forEach((category) => {
        if (!categories[category]) return;
        Object.values(categories[category].groups).forEach((group) => {
          Object.entries(group.subcategories).forEach(([sub, documents]) => {
            documents.forEach((doc) => {
              const categoryId = documentCategoryIds[doc];
              if (!categoryId) return;
              const key = `${projectId}__${categoryId}__${doc}`;
              if (!fetchedDocuments[key] && !fetchingDocuments[key]) {
                fetchDocument(projectId, categoryId, doc);
              }
            });
          });
        });
      });
    });
  }, [
    table.getRowModel().rows.map((row) => row.getIsExpanded()).join(","),
    data,
    fetchedDocuments,
    fetchingDocuments,
  ]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editFormData).forEach(([key, value]) => {
      if (value instanceof File || typeof value === "string") formData.append(key, value);
    });
    updateProjectMutation.mutate(formData);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error: {(error as any).message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="max-w-xs"
        />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-2 gap-6 py-4">
              {Object.entries(editFormData).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </Label>
                  {key.includes("date") ? (
                    <Input
                      id={key}
                      type="date"
                      value={String(value).split("T")[0]}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                    />
                  ) : key.includes("attachment") ? (
                    <Input
                      id={key}
                      type="file"
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.files?.[0] || null })}
                    />
                  ) : key === "project_type" || key === "project_category" ? (
                    <Select
                      value={String(value)}
                      onValueChange={(v) => setEditFormData({ ...editFormData, [key]: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${key}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {key === "project_type" ? (
                          <>
                            <SelectItem value="Governmental">Governmental</SelectItem>
                            <SelectItem value="Non Governmental">Non Governmental</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="Road Construction">Road Construction</SelectItem>
                            <SelectItem value="Water and Irrigation">Water and Irrigation</SelectItem>
                            <SelectItem value="Building Construction">Building Construction</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={key}
                      value={String(value)}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateProjectMutation.isPending}>
                {updateProjectMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProject?.project_name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteProjectMutation.mutate()} disabled={deleteProjectMutation.isPending}>
              {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Letters Dialog */}
      <Dialog open={isLetterModalOpen} onOpenChange={setIsLetterModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Letters for {selectedProject?.project_name}</DialogTitle>
            <DialogDescription>Project ID: {selectedProject?.project_id}</DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-lg max-h-[60vh] overflow-y-auto">
            {fetchingLetters[selectedProject?.project_id || ""] ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : projectLetters[selectedProject?.project_id || ""]?.length > 0 ? (
              <div className="space-y-4">
                {(() => {
                  const sortedLetters = [...projectLetters[selectedProject?.project_id || ""]].sort(
                    (a, b) => new Date(b.sent_date).getTime() - new Date(a.sent_date).getTime()
                  );
                  const recentLetter = sortedLetters[0];
                  const previousLetters = sortedLetters.slice(1);
                  let formattedDate = "Date not available";
                  if (recentLetter.sent_date) {
                    try {
                      const parsedDate = parse(recentLetter.sent_date, "yyyy-MM-dd HH:mm:ss", new Date());
                      if (isValid(parsedDate)) formattedDate = format(parsedDate, "PPPP");
                      else {
                        const isoDate = new Date(recentLetter.sent_date);
                        if (isValid(isoDate)) formattedDate = format(isoDate, "PPPP");
                      }
                    } catch (error) {
                      console.error(`Failed to parse date for letter ${recentLetter.letter_id}:`, recentLetter.sent_date, error);
                    }
                  }
                  return (
                    <>
                      <div className="border-b pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Ref: {recentLetter.reference_number || "N/A"}</p>
                            <p className="text-sm text-gray-500">Date: {formattedDate}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={!recentLetter.letter_id || recentLetter.letter_id.includes("fallback-")}
                            onClick={() => {
                              if (!recentLetter.letter_id || recentLetter.letter_id.includes("fallback-")) return;
                              navigate({ to: "/project-owner/$letterId", params: { letterId: recentLetter.letter_id } });
                            }}
                            title="View letter"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {previousLetters.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="previous-letters">
                            <AccordionTrigger className="flex items-center gap-2">
                              <ChevronDown className="h-4 w-4" />
                              <span>Previous Letters ({previousLetters.length})</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4">
                                {previousLetters.map((letter) => {
                                  let formattedDate = "Date not available";
                                  if (letter.sent_date) {
                                    try {
                                      const parsedDate = parse(letter.sent_date, "yyyy-MM-dd HH:mm:ss", new Date());
                                      if (isValid(parsedDate)) formattedDate = format(parsedDate, "PPPP");
                                      else {
                                        const isoDate = new Date(letter.sent_date);
                                        if (isValid(isoDate)) formattedDate = format(isoDate, "PPPP");
                                      }
                                    } catch (error) { console.error(error); }
                                  }
                                  return (
                                    <div key={letter.letter_id} className="border-b pb-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-semibold">Ref: {letter.reference_number || "N/A"}</p>
                                          <p className="text-sm text-gray-500">Date: {formattedDate}</p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          disabled={!letter.letter_id || letter.letter_id.includes("fallback-")}
                                          onClick={() => navigate({ to: "/project-owner/$letterId", params: { letterId: letter.letter_id } })}
                                          title="View letter"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <p>No letters available for this project.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLetterModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Table */}
      <div className="rounded-2xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()} className={header.column.getCanSort() ? "cursor-pointer" : ""}>
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="ml-2">
                          {!header.column.getIsSorted() ? (
                            <ArrowDownUp size={14} className="text-gray-400" />
                          ) : header.column.getIsSorted() === "asc" ? (
                            <ArrowUpNarrowWide size={14} />
                          ) : (
                            <ArrowDownWideNarrow size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={table.getAllColumns().length}>
                      <div className="p-4">
                        <Card className="p-4">
                          <Tabs
                            value={activeTab}
                            onValueChange={(value) =>
                              setActiveTab(value as "building" | "water" | "transport" | "others")
                            }
                          >
                            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-1 shadow-md">
                              <TabsTrigger value="building" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-700">
                                Building Construction
                              </TabsTrigger>
                              <TabsTrigger value="water" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-700">
                                Water and Energy
                              </TabsTrigger>
                              <TabsTrigger value="transport" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-700">
                                Road Construction
                              </TabsTrigger>
                              <TabsTrigger value="others" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-700">
                                Others
                              </TabsTrigger>
                            </TabsList>

                            {(["building", "water", "transport", "others"] as const).map((category) => {
                              // For building/transport we show one submit button at the bottom
                              // For water we show submit per sub-accordion
                              const isBuildingRoad = category === "building" || category === "transport";
                              const canSubmitBuildingRoad = isBuildingRoad
                                ? isBuildingRoadSubmissionAllowed(row.original.project_id || "", category as "building" | "transport")
                                : false;

                              return (
                                <TabsContent key={category} value={category}>
                                  <div className="space-y-4">
                                    {Object.entries(categories[category]?.groups || {}).map(([groupName, group]) => (
                                      <Accordion key={groupName} type="single" collapsible className="w-full">
                                        <AccordionItem value={groupName}>
                                          <AccordionTrigger className="text-lg font-semibold bg-gray-100 px-4 rounded-lg">
                                            {groupName === "Design Review" && "🏗️ "}
                                            {groupName}
                                          </AccordionTrigger>
                                          <AccordionContent className="pt-4">
                                            <Accordion type="multiple" className="space-y-4">
                                              {Object.entries(group.subcategories).map(([sub, documents]) => (
                                                <AccordionItem
                                                  key={`${category}_${groupName}_${sub}`}
                                                  value={`${category}_${groupName}_${sub}`}
                                                >
                                                  <AccordionTrigger>
                                                    <div className="flex items-center gap-2">
                                                      <span>{sub}</span>
                                                      <span className="text-sm text-gray-500">
                                                        (
                                                        {uploadCounts[row.original.project_id]?.subcategories[`${category}_${sub}`]?.uploaded || 0}
                                                        /
                                                        {uploadCounts[row.original.project_id]?.subcategories[`${category}_${sub}`]?.total || documents.length}
                                                        )
                                                      </span>
                                                    </div>
                                                  </AccordionTrigger>
                                                  <AccordionContent className="p-4 bg-gray-50 rounded-lg space-y-4">
                                                    {documents.map((doc) => {
                                                      const key = `${row.original.project_id}__${documentCategoryIds[doc]}__${doc}`;
                                                      const files = fileInputs[key];
                                                      const isUploaded = !!documentData[key]?.latest_version;
                                                      const documentInfo = documentData[key];
                                                      const isFetching = fetchingDocuments[key];
                                                      const isUnderApproval = approvalStatus[key] || false;
                                                      const isMandatory = allMandatoryDocumentNames.has(doc);
                                                      return (
                                                        <div key={key} className="space-y-2 border-b pb-4">
                                                          <div className="flex items-center gap-2">
                                                            <Label htmlFor={key} className="font-medium">
                                                              {doc}
                                                              {isMandatory && <span className="text-red-500 ml-1">*</span>}
                                                            </Label>
                                                            {files && files.length > 0 && (
                                                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {files.length} file(s)
                                                              </span>
                                                            )}
                                                            {isUnderApproval && (
                                                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                                Under Approval
                                                              </span>
                                                            )}
                                                          </div>
                                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="md:col-span-2">
                                                              <div className="relative flex-1">
                                                                {isUploaded && <Pencil className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />}
                                                                <div className="flex items-center gap-2">
                                                                  <CustomFileInput
                                                                    id={key}
                                                                    disabled={
                                                                      uploadStatus[key] === "uploading" ||
                                                                      isFetching ||
                                                                      isUnderApproval
                                                                    }
                                                                    onChange={(e) => handleInputChange(key, e.target.files)}
                                                                    files={fileInputs[key]}
                                                                    isUploaded={isUploaded}
                                                                    documentName={doc}
                                                                    onRemoveFile={(index) => handleRemoveFile(key, index)}
                                                                  />
                                                                  {uploadStatus[key] === "uploading" && <Loader2 className="h-4 w-4 animate-spin" />}
                                                                  {uploadStatus[key] === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                                                                  {uploadStatus[key] === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                                                                </div>
                                                              </div>
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                              <Button
                                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                                                                onClick={() => {
                                                                  const files = fileInputs[key];
                                                                  if (files && files.length > 0 && uploadStatus[key] !== "success" && !fetchingDocuments[key]) {
                                                                    if (documentInfo) {
                                                                      handleUpdateMultipleDocuments(
                                                                        row.original.project_id || "",
                                                                        row.original.project_id || "",
                                                                        documentCategoryIds[doc],
                                                                        doc,
                                                                        files,
                                                                        key
                                                                      );
                                                                    } else {
                                                                      handleUploadMultipleFiles(
                                                                        files,
                                                                        doc,
                                                                        key,
                                                                        row.original.project_id || "",
                                                                        row.original.project_id || ""
                                                                      );
                                                                    }
                                                                  }
                                                                }}
                                                                disabled={
                                                                  isFetching ||
                                                                  !files ||
                                                                  files.length === 0 ||
                                                                  isUnderApproval ||
                                                                  uploadStatus[key] === "uploading"
                                                                }
                                                              >
                                                                <CloudUpload className="h-4 w-4" />
                                                                {documentInfo ? "Update" : "Upload"}
                                                              </Button>
                                                              <div className="text-xs text-center text-gray-500">
                                                                {files?.length || 0} file(s) selected
                                                              </div>
                                                            </div>
                                                          </div>
                                                          {documentInfo?.latest_version && (
                                                            <div className="flex items-center gap-2 mt-2 text-sm">
                                                              <span className="text-gray-600">
                                                                Current: {documentInfo.latest_version.file_name} (v{documentInfo.latest_version.version_number})
                                                              </span>
                                                              {projectLetters[row.original.project_id || ""]?.length > 0 && (
                                                                <>
                                                                  <input
                                                                    type="file"
                                                                    id={`version-upload-${key}`}
                                                                    className="hidden"
                                                                    multiple
                                                                    onChange={(e) => {
                                                                      const files = e.target.files;
                                                                      if (files && files.length > 0) {
                                                                        handleVersionUpload(
                                                                          row.original.project_id || "",
                                                                          documentCategoryIds[doc],
                                                                          doc,
                                                                          Array.from(files),
                                                                          key
                                                                        );
                                                                      }
                                                                    }}
                                                                    ref={(el) => (fileInputRefs.current[key] = el)}
                                                                  />
                                                                  <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 w-6 p-0"
                                                                    onClick={() => fileInputRefs.current[key]?.click()}
                                                                    title="Upload new version"
                                                                  >
                                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                                  </Button>
                                                                </>
                                                              )}
                                                              {documentInfo.latest_version.hasRejectionLetter && (
                                                                <FileText className="h-4 w-4 text-red-600" title="Rejection letter exists" />
                                                              )}
                                                              {(documentInfo.latest_version.hasLetter || documentInfo.latest_version.letterContent) && (
                                                                <Button
                                                                  variant="ghost"
                                                                  size="sm"
                                                                  className="h-6 w-6 p-0"
                                                                  onClick={() => fetchLetter(documentInfo.latest_version!.id, doc)}
                                                                  title="View letter"
                                                                >
                                                                  <Mail className="h-4 w-4" />
                                                                </Button>
                                                              )}
                                                            </div>
                                                          )}
                                                        </div>
                                                      );
                                                    })}
                                                    <div className="mt-6 pt-4 border-t">
                                                      <Button
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                                                        onClick={() => {
                                                          const uploadPromises = documents.map((doc) => {
                                                            const key = `${row.original.project_id}__${documentCategoryIds[doc]}__${doc}`;
                                                            const files = fileInputs[key];
                                                            if (files && files.length > 0 && uploadStatus[key] !== "success" && !fetchingDocuments[key]) {
                                                              const documentInfo = documentData[key];
                                                              if (documentInfo) {
                                                                return handleUpdateMultipleDocuments(
                                                                  row.original.project_id || "",
                                                                  row.original.project_id || "",
                                                                  documentCategoryIds[doc],
                                                                  doc,
                                                                  files,
                                                                  key
                                                                );
                                                              } else {
                                                                return handleUploadMultipleFiles(
                                                                  files,
                                                                  doc,
                                                                  key,
                                                                  row.original.project_id || "",
                                                                  row.original.project_id || ""
                                                                );
                                                              }
                                                            }
                                                            return Promise.resolve();
                                                          });
                                                          Promise.all(uploadPromises).then(() => {
                                                            toast({ title: "Uploads Started", description: "All file uploads have been initiated" });
                                                          });
                                                        }}
                                                        disabled={!areAllFilesSelected(documents, row.original.project_id || "")}
                                                      >
                                                        <CloudUpload className="h-4 w-4" />
                                                        Upload All in "{sub}"
                                                      </Button>
                                                      {!areAllFilesSelected(documents, row.original.project_id || "") && (
                                                        <p className="text-sm text-red-600 mt-2 text-center">
                                                          Please select files for all documents in this section
                                                        </p>
                                                      )}
                                                    </div>

                                                    {/* Water tab: per-sub-accordion submit button */}
                                                    {category === "water" && (
                                                      <div className="mt-4 pt-2 border-t flex justify-end">
                                                        <Button
                                                          onClick={async () => {
                                                            const allowed = isWaterSubAccordionAllowed(row.original.project_id || "", sub);
                                                            if (!allowed) {
                                                              toast({
                                                                title: "Cannot Submit",
                                                                description: "Either complete all mandatory documents in this sub‑accordion OR complete Cost Approval + Design Build + Global Letter.",
                                                                variant: "destructive",
                                                              });
                                                              return;
                                                            }
                                                            const keysToSubmit = getKeysForWaterSubmission(row.original.project_id || "", sub);
                                                            if (keysToSubmit.length === 0) {
                                                              toast({ title: "No files to submit", description: "No staged files found.", variant: "destructive" });
                                                              return;
                                                            }
                                                            try {
                                                              setSubmittingSubAccordion(sub);
                                                              await submitDocuments(row.original.project_id || "", keysToSubmit, `water_${sub}`);
                                                            } finally {
                                                              setSubmittingSubAccordion(null);
                                                            }
                                                          }}
                                                          disabled={submittingSubAccordion === sub}
                                                          className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        >
                                                          {submittingSubAccordion === sub && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                          Submit {sub}
                                                        </Button>
                                                      </div>
                                                    )}
                                                  </AccordionContent>
                                                </AccordionItem>
                                              ))}
                                            </Accordion>
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    ))}
                                  </div>

                                  {/* Building/Road/Others: main submit button at bottom */}
                                  {category !== "water" && (
                                    <div className="mt-6 pt-4 border-t flex justify-end">
                                      <Button
                                        onClick={async () => {
                                          let allowed = false;
                                          let keysToSubmit: string[] = [];
                                          if (category === "building" || category === "transport") {
                                            allowed = isBuildingRoadSubmissionAllowed(row.original.project_id || "", category as "building" | "transport");
                                            if (allowed) {
                                              keysToSubmit = getKeysForBuildingRoadSubmission(row.original.project_id || "", category as "building" | "transport");
                                            }
                                          } else if (category === "others") {
                                            allowed = isOthersTabAllowed(row.original.project_id || "");
                                            if (allowed) {
                                              keysToSubmit = getKeysForOthersSubmission(row.original.project_id || "");
                                            }
                                          }
                                          if (!allowed) {
                                            toast({
                                              title: "Missing Mandatory Documents",
                                              description: category === "others"
                                                ? "Please complete all mandatory documents."
                                                : "Please complete Letter + (Design Review OR Cost Approval + Design Build).",
                                              variant: "destructive",
                                            });
                                            return;
                                          }
                                          if (keysToSubmit.length === 0) {
                                            toast({ title: "No files to submit", description: "No staged files found.", variant: "destructive" });
                                            return;
                                          }
                                          try {
                                            setSubmittingTab(category);
                                            await submitDocuments(row.original.project_id || "", keysToSubmit, category);
                                          } finally {
                                            setSubmittingTab(null);
                                          }
                                        }}
                                        disabled={
                                          submittingTab === category ||
                                          (category === "building" || category === "transport"
                                            ? !canSubmitBuildingRoad
                                            : category === "others"
                                            ? !isOthersTabAllowed(row.original.project_id || "")
                                            : false)
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        {submittingTab === category && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit All for {category === "building" ? "Building" : category === "transport" ? "Road" : "Others"} Review
                                      </Button>
                                    </div>
                                  )}
                                </TabsContent>
                              );
                            })}
                          </Tabs>
                        </Card>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between p-4 items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
          <span>
            Page <strong>{pagination.pageIndex + 1} of {table.getPageCount()}</strong>
          </span>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(v) => setPagination({ pageIndex: 0, pageSize: Number(v) })}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  Show {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default DesignDocumentPage;