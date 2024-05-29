# 从零构建自己的 CLI 程序

> CLI Target: 让我们的操作变得更高效、更规范！

# 特性

1. 获取帮助信息指令`mycli || mycli -h`
2. 创建项目指令`mycli create <projectName>`

# 步骤

1. 初始化项目
   - 在 `package.json > bin 字段` 声明命令指向的执行文件，像这样：
   ```json
   {
     "name": "zhangxianjie-cli",
     "bin": {
       "mycli": "index.js"
     }
   }
   ```
   - 创建 `index.js` 文件，并添加以下代码：
   ```js
   #!/usr/bin/env node // 告诉计算机用 node 解释器来执行下面的代码
   console.log("zhangxianjie-cli is running...");
   ```
   - 执行 `npm link` 命令，将 `mycli` 链接到全局环境中，这样我们就可以在任何地方使用 `mycli` 命令了
   - 测试命令：`npx which mycli`
2. 实现用户与终端交互:

   - `npm i commander -S` 专门处理参数解析
   - `npm i inquirer -S` 提供交互输入方式`如下拉框、输入框等`
   - 测试代码如下：

   ```js
    #!/usr/bin/env node

    import { program } from "commander";
    import inquirer from "inquirer";

    // 定义 create 命令
    program
    .command("create <project>")
    .description("创建一个新项目")
    .action((project) => {
        inquirer
        .prompt([
            {
            type: "input",
            name: "ProjectName",
            message: "请输入项目名称：",
            default: project || "my-project",
            },
        ])
        .then((answers) => {
            console.log("answers::: ", answers);
        });
    });

    //   解析 args、设置选项、监听事件
    program.parse();
   ```

3. 实现模板下载功能

   - 安装`npm i shelljs` 用于帮助我们执行终端命令
   - 安装`npm i ora` 用于帮助我们展示加载动画
   - 安装`npm i chalk` 用于帮助我们美化文字输出
   - 最终代码如下

   ```js
   import inquirer from "inquirer";
   import shell from "shelljs";
   import ora from "ora";
   import chalk from "chalk";

   const gitProjects = {
     js: {
       repository: "git@github.com:zhangxianjue-templates/javascript.git",
       desc: "创建原生 JS 项目",
     },
   };

   // 创建指令的回调函数
   export const createProjectAction = (project) => {
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
         // 克隆项目
         const spinner = ora().start();
         const cloneCode = shell.exec(`git clone ${gitProjects[ProjectType].repository} ${ProjectName}`);
         if (cloneCode.code == 0) {
           spinner.succeed(chalk.green("项目克隆成功"));
           shell.rm("-rf", `${ProjectName}/.git`); // 删除 .git 文件夹
           shell.exit(0); // 退出 shell
         } else {
           spinner.fail(chalk.red("项目克隆失败"));
           shell.exit(1); // 0 表示成功，非 0 表示失败
         }
       });
   };
   ```
