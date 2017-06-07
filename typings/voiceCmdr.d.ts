interface VoiceCmdr {
    isSupported(): boolean;
    addCommand(command: string, callback: () => void): void;
    removeCommand(command: string): boolean;
    start(): void,
    stop(): void,
    getCommand(): void;
    debug(isDebugging: boolean): void;
    isRecognizing(): boolean;
}

declare var voiceCmdr: VoiceCmdr;