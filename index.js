#!/usr/bin/env node

import { program } from "commander";
import { registerCommand } from "./src/utils.js";
import CreateCommand from "./src/commands/create.js";

// 注册命令
registerCommand.call(program, [new CreateCommand()]);

//  解析参数，也可以省略参数而使用process.argv
program.parse();
