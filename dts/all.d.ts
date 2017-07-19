import Global = NodeJS.Global;

interface ISumanGlobal extends Global {
  sumanOpts: Object
}


interface IRet {
  count: number,
  cb: Function
}