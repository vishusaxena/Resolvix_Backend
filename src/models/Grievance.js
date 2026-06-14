const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema(
  {
    grievanceCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    tenantCode: {
      type: String,
      required: true,
      index: true,
    },

    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    accessKey: {
      type: String,
      required: true,
      index: true,
    },

    grievanceDetails: {
      complainantName: {
        type: String,
        trim: true,
      },

      complainantEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },

      complainantPhone: {
        type: String,
        trim: true,
      },

      complaintType: {
        type: String,
        enum: ["Anonymous", "Named"],
        required: true,
        default: "Anonymous",
      },

      complaintSubject: {
        type: String,
        required: true,
        trim: true,
      },

      complaintDetails: {
        type: String,
        required: true,
        trim: true,
      },

      complaintPriority: {
        type: String,
        required: true,
        enum: ["High", "Medium", "Low"],
        default: "Medium",
      },

      complaintDepartment: {
        departmentCode: {
          type: String,
          required: true,
        },
        departmentName: {
          type: String,
          required: true,
        },
      },

      complaintAttachments: [
        {
          fileName: String,
          fileExt: String,
          url: String,
          publicId: String,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    grievanceStatus: {
      type: String,
      enum: [
        "Filed",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed",
        "Rejected",
      ],
      default: "Filed",
      index: true,
    },

    assignedTo: {
      name: String,
      userCode: String,
      email: String,
      assignedAt: Date,
    },

    assignmentHistory: [
      {
        assignedTo: String,
        assignedToCode: String,
        assignedBy: String,
        assignedByCode: String,
        assignedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "Filed",
            "Assigned",
            "In Progress",
            "Resolved",
            "Closed",
            "Rejected",
          ],
          default: "Filed",
        },

        remarks: String,

        updatedBy: String,

        updatedByCode: String,

        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    resolutionDetails: {
      remarks: String,

      resolvedBy: String,

      resolvedByCode: String,

      resolvedAt: Date,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    slaDueDate: Date,

    firstResponseAt: Date,

    closedAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Useful indexes
grievanceSchema.index({ tenantCode: 1, grievanceCode: 1 });
grievanceSchema.index({ tenantCode: 1, trackingId: 1 });
grievanceSchema.index({ tenantCode: 1, grievanceStatus: 1 });
grievanceSchema.index({
  tenantCode: 1,
  "grievanceDetails.complaintDepartment.departmentCode": 1,
});

module.exports = mongoose.model("Grievance", grievanceSchema);
