import Global = NodeJS.Global;

interface ISumanGlobal extends Global {
  sumanOpts: Object
}

interface IResultsObj{
  n: number,
  passes: number,
  failures: number,
  skipped: number,
  stubbed: number
}


interface IRet {
  results: IResultsObj,
  reporterName: string,
  count: number,
  cb: Function,
  completionHook?: Function
}
