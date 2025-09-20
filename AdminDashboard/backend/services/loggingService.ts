import AuditLog from "../models/AuditLog.js";

export const loggingEvent = async (
    userId: string,
    eventType: string,
    ipAddress: string,
    details: object = {}
) => {
    try {
        const loggingEntry = new AuditLog({
            userId,
            eventType,
            ipAddress,
            details,
        });
        await loggingEntry.save();
        console.log(`Audit log created for event: ${eventType}`);
    } catch (err) {
        console.error('Failed to create audit log entry:', err);
    }
};