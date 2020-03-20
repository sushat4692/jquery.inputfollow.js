export type RuleFlag = {
  [key: string]: boolean
}

export type Rule = {
  [key: string]: RuleOption | RuleOption[]
}

export type RuleOption = {
  type: string
  mode?: string
  with?: string[]
  if?: { [key: string]: string }
}

export type Message = {
  [key: string]: {
    [key: string]: string
  }
}

export type Target = {
  [key: string]: JQuery
}

export type InitialParam = {
  rules?: Rule
  messages?: Message
  error_class?: string
  valid_class?: string
  initial_error_view?: boolean
  on_validate?: Function
  on_success?: Function
  on_error?: Function
}
