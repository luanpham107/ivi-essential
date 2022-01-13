/* eslint-disable @typescript-eslint/naming-convention */
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";

import * as fs from "fs";
import * as crypto from "crypto";
import * as ssh2 from 'ssh2';
import * as ssh2_streams from 'ssh2-streams';
import { Vcloud } from "../cloud/vcloud";

declare var inspect: any;

const configKeys = {
    LOG_LEVEL: "arduino.logLevel",
    DEFAULT_BAUD_RATE: "arduino.defaultBaudRate",
    DISABLE_INTELLISENSE_AUTO_GEN: "arduino.disableIntelliSenseAutoGen",
    IVI_DEFAULT_VCLOUD: "ivi.defaultVcloud"
};

export interface IVscodeSettings {
    logLevel: string;
    defaultBaudRate: number;
    disableIntelliSenseAutoGen: boolean;
    defaultVcloud: string;
    defaultVcloudConfig(config: string): Vcloud;
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

    public get defaultVcloud(): string {
        return this.getConfigValue<string>(configKeys.IVI_DEFAULT_VCLOUD);
    }

    public get logLevel(): string {
        return this.getConfigValue<string>(configKeys.LOG_LEVEL) || "info";
    }

    public get defaultBaudRate(): number {
        return this.getConfigValue<number>(configKeys.DEFAULT_BAUD_RATE);
    }

    public get disableIntelliSenseAutoGen(): boolean {
        return this.getConfigValue<boolean>(configKeys.DISABLE_INTELLISENSE_AUTO_GEN);
    }

    public defaultVcloudConfig(defaultCloudKey: string): Vcloud {
        // console.log('Get ' + defaultCloudKey + '.name');
        this.getConfigValue<string>("ivi.cloudList.cloud1.name");
        this.getConfigValue<string>("ivi.cloudList.cloud1.ip");
        this.getConfigValue<string>("ivi.cloudList.cloud1.password");
        
        var _vcloud = new Vcloud('_name', '_ip', '_psw');
        console.log('Default vcloud: ' + _vcloud.name + ', ' + _vcloud.ip + ', ' + _vcloud.password);
        return _vcloud;
    }
    public async updateAdditionalUrls(value) {
        await this.setConfigValue(configKeys.IVI_DEFAULT_VCLOUD, value, true);
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
