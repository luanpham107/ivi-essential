/* eslint-disable @typescript-eslint/naming-convention */
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";

declare var inspect: any;

export interface IVcloud {
    name: string;
    ip: string,
    password: string,
}

export class Vcloud implements IVcloud {
    constructor(name: string, ip: string, password: string) {}

    public get name(): string {
        return this.name;
    }

    public set name(_name: string) {
        this.name = _name;
    }

    public get ip(): string {
        return this.ip;
    }

    public set ip(_ip: string) {
        this.ip = _ip;
    }

    public get password(): string {
        return this.password;
    }

    public set password(_password: string) {
        this.password = _password;
    }

}