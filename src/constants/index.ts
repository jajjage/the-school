import { AuthFormProps, SIGN_IN_FORM, SIGN_UP_FORM } from "./forms"
import {
  GROUP_PAGE_MENU,
  GroupMenuProps,
  LANDING_PAGE_MENU,
  MenuProps,
} from "./menus"
import {
  CREATE_GROUP_PLACEHOLDER,
  CreateGroupPlaceholderProps,
} from "./placeholder"
import { PRICING_TIER, PricingTier } from "./pricing"
import { GROUP_LIST, GroupListProps } from "./slider"

type GroupleConstantsProps = {
  landingPageMenu: MenuProps[]
  pricingTier: PricingTier[]
  signUpForm: AuthFormProps[]
  signInForm: AuthFormProps[]
  groupList: GroupListProps[]
  createGroupPlaceholder: CreateGroupPlaceholderProps[]
  groupPageMenu: GroupMenuProps[]
}

export const GROUPLE_CONSTANTS: GroupleConstantsProps = {
  landingPageMenu: LANDING_PAGE_MENU,
  pricingTier: PRICING_TIER,
  signUpForm: SIGN_UP_FORM,
  signInForm: SIGN_IN_FORM,
  groupList: GROUP_LIST,
  createGroupPlaceholder: CREATE_GROUP_PLACEHOLDER,
  groupPageMenu: GROUP_PAGE_MENU,
}
