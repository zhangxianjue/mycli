// 命令类
export class Command {
  constructor(args, desc) {
    this.args = args;
    this.desc = desc;
  }
  action() {}
}

// 注册命令函数
export const registerCommand = function (arr) {
  arr.forEach((item) => {
    const { args, desc, action } = item;
    this.command(args).description(desc).action(action); // 定义 create 命令
  });
};
