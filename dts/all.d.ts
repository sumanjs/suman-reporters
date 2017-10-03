import Global = NodeJS.Global;

interface ISumanGlobal extends Global {
  sumanOpts: Object
}


interface IRet {
  reporterName: string,
  count: number,
  cb: Function
}