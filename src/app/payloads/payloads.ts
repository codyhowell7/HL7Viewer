import { WorkspaceMode } from '../enums/enums';

export interface IWorkspaceModeChangedPayload {
    mode: WorkspaceMode;
}

export interface IIdPayload {
    id: number;
}

export interface IMessageReceivedPayload extends IIdPayload {
    message: string;
}