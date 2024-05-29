import inquirer from "inquirer";
import shell from "shelljs";
import ora from "ora";
import chalk from "chalk";

import { Command } from "../utils.js";

const gitProjects = {
  js: {
    repository: "git@github.com:zhangxianjue-templates/javascript.git",
    desc: "创建原生 JS 项目",
  },
};

export default class CreateCommand extends Command {
  constructor(args = "create [project]", desc = "创建一个新项目") {
    super(args, desc);
  }
  action(project) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "ProjectName",
          message: "请输入项目名称：",
          default: project || "my-project",
        },
        {
          type: "list",
          name: "ProjectType",
          message: "请选择项目类型：",
          choices: Object.keys(gitProjects),
        },
      ])
      .then((answers) => {
        const { ProjectName, ProjectType } = answers;
        // 创建项目
        const spinner = ora().start();
        const cloneCode = shell.exec(`git clone ${gitProjects[ProjectType].repository} ${ProjectName}`);
        if (cloneCode.code == 0) {
          spinner.succeed(chalk.green("项目创建成功"));
          shell.rm("-rf", `${ProjectName}/.git`); // 删除 .git 文件夹
          shell.exit(0); // 退出 shell
        } else {
          spinner.fail(chalk.red("项目创建失败"));
          shell.exit(1); // 0 表示成功，非 0 表示失败
        }
      });
  }
}
