//based on some research, it seems a good compliance measure is to have an immutable audit log.
import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
    userId: string;
    eventType: string; //{Action_Status} example: LOGIN_SUCCESS. TODO: make enum
    timestamp: Date;
    ipAddress: string;
    details: object;
}

const AuditLogSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    eventType: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    details: {
        type: Object,
        required: false,
    },
});

const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;