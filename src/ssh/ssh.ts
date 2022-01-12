/* eslint-disable @typescript-eslint/naming-convention */
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";

import * as fs from "fs";
import * as crypto from "crypto";
import * as ssh2 from 'ssh2';
import * as ssh2_streams from 'ssh2-streams';

declare var inspect: any;

const configKeys = {
    ARDUINO_COMMAND_PATH: "arduino.commandPath",
    ADDITIONAL_URLS: "arduino.additionalUrls",
    LOG_LEVEL: "arduino.logLevel",
    AUTO_UPDATE_INDEX_FILES: "arduino.autoUpdateIndexFiles",
    ENABLE_USB_DETECTION: "arduino.enableUSBDetection",
    DISABLE_TESTING_OPEN: "arduino.disableTestingOpen",
    IGNORE_BOARDS: "arduino.ignoreBoards",
    SKIP_HEADER_PROVIDER: "arduino.skipHeaderProvider",
    DEFAULT_BAUD_RATE: "arduino.defaultBaudRate",
    USE_ARDUINO_CLI: "arduino.useArduinoCli",
    DISABLE_INTELLISENSE_AUTO_GEN: "arduino.disableIntelliSenseAutoGen",
};

export interface IVscodeSettings {
    commandPath: string;
    additionalUrls: string | string[];
    logLevel: string;
    enableUSBDetection: boolean;
    disableTestingOpen: boolean;
    ignoreBoards: string[];
    skipHeaderProvider: boolean;
    defaultBaudRate: number;
    useArduinoCli: boolean;
    disableIntelliSenseAutoGen: boolean;

    startSSHConnection(): void;
    updateAdditionalUrls(urls: string | string[]): void;
}

export class VscodeSettings implements IVscodeSettings {
    public static getInstance(): IVscodeSettings {
        if (!VscodeSettings._instance) {
            VscodeSettings._instance = new VscodeSettings();
        }
        return VscodeSettings._instance;
    }

    private static _instance: IVscodeSettings;
    private constructor() {
    }

    public get commandPath(): string {
        return this.getConfigValue<string>(configKeys.ARDUINO_COMMAND_PATH);
    }

    public get additionalUrls(): string | string[] {
        return this.getConfigValue<string | string[]>(configKeys.ADDITIONAL_URLS);
    }

    public get logLevel(): string {
        return this.getConfigValue<string>(configKeys.LOG_LEVEL) || "info";
    }

    public get enableUSBDetection(): boolean {
        return this.getConfigValue<boolean>(configKeys.ENABLE_USB_DETECTION);
    }

    public get disableTestingOpen(): boolean {
        return this.getConfigValue<boolean>(configKeys.DISABLE_TESTING_OPEN);
    }

    public get ignoreBoards(): string[] {
        return this.getConfigValue<string[]>(configKeys.IGNORE_BOARDS);
    }

    public set ignoreBoards(value: string[]) {
        this.setConfigValue(configKeys.IGNORE_BOARDS, value, true);
    }

    public get defaultBaudRate(): number {
        return this.getConfigValue<number>(configKeys.DEFAULT_BAUD_RATE);
    }

    public get useArduinoCli(): boolean {
        return this.getConfigValue<boolean>(configKeys.USE_ARDUINO_CLI);
    }

    public get skipHeaderProvider(): boolean {
        return this.getConfigValue<boolean>(configKeys.SKIP_HEADER_PROVIDER);
    }

    public get disableIntelliSenseAutoGen(): boolean {
        return this.getConfigValue<boolean>(configKeys.DISABLE_INTELLISENSE_AUTO_GEN);
    }

    public async updateAdditionalUrls(value) {
        await this.setConfigValue(configKeys.ADDITIONAL_URLS, value, true);
    }

    public startSSHConnection() {
        console.log('Start SSH');
        var Client = require('ssh2').Client;
        var conn = new Client();
        conn.on('ready', () => {
            console.log('Client :: ready');
            conn.sftp( (err: Error, sftp: ssh2.SFTPWrapper) => {
                if (err) throw err;
                sftp.readdir('foo', (err: Error, list: ssh2_streams.FileEntry[]) => {
                    if (err) throw err;
                    console.dir(list);
                    conn.end();
                });
            });
        }).connect({
            host: '192.168.100.100',
            port: 22,
            username: 'luan1.pham',
            password: 'khongcopass'
        });
        console.log('End SSH');
    }

    private getConfigValue<T>(key: string): T {
        const workspaceConfig = vscode.workspace.getConfiguration();
        return workspaceConfig.get<T>(key);
    }

    private async setConfigValue(key: string, value, global: boolean = true) {
        const workspaceConfig = vscode.workspace.getConfiguration();
        await workspaceConfig.update(key, value, global);
    }
}
