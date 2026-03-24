import { z } from 'zod'

export const serviceTypeEnum = z.enum(['brand', 'web', 'app', 'revops'])
export type ServiceType = z.infer<typeof serviceTypeEnum>

const brandSchema = z.object({
  situation:           z.enum(['new', 'rebrand', 'refresh', '']).default(''),
  businessDescription: z.string().default(''),
  mission:             z.string().default(''),
  customerDescription: z.string().default(''),
  competitors:         z.string().default(''),
  coreMessages:        z.string().default(''),
  personality:         z.enum(['expert', 'advisor', 'visionary', 'premium', 'bold', '']).default(''),
  wordsYes:            z.string().default(''),
  wordsNo:             z.string().default(''),
  brandAdmired:        z.string().default(''),
  existingAssets:      z.enum(['keep', 'retire', 'none', '']).default(''),
  deliverables:        z.array(z.string()).default([]),
  agencyHistory:       z.string().default(''),
})

const webSchema = z.object({
  currentSite:       z.enum(['none', 'rebuild', 'update', '']).default(''),
  primaryJob:        z.enum(['leads', 'cred', 'convert', 'launch', '']).default(''),
  brokenAndCost:     z.string().default(''),
  successMetrics:    z.string().default(''),
  mustHaveFeatures:  z.string().default(''),
  techPreference:    z.enum(['cms', 'custom', 'open', '']).default(''),
  copyStatus:        z.enum(['ready', 'rough', 'none', '']).default(''),
  postLaunchOwner:   z.enum(['internal', 'dev', 'ongoing', 'tbd', '']).default(''),
  siteInspiration:   z.string().default(''),
})

const appSchema = z.object({
  coreFunction:      z.string().default(''),
  userType:          z.enum(['int', 'ext', 'both', '']).default(''),
  userVolume:        z.string().default(''),
  systemConnections: z.string().default(''),
  sensitiveData:     z.enum(['yes', 'no', 'unsure', '']).default(''),
  specStatus:        z.enum(['defined', 'partial', 'loose', '']).default(''),
  costOfInaction:    z.string().default(''),
  operationalDone:   z.string().default(''),
  previousAttempts:  z.string().default(''),
})

const revopsSchema = z.object({
  brokenProcess:   z.string().default(''),
  problemType:     z.enum(['people', 'process', 'tools', 'all', '']).default(''),
  currentStack:    z.string().default(''),
  affectedCount:   z.enum(['solo', 'sm', 'md', 'lg', '']).default(''),
  adoptionHistory: z.string().default(''),
  successAt90Days: z.string().default(''),
  budgetStatus:    z.enum(['yes', 'pending', 'tbd', '']).default(''),
})

/** Default values for each section — used when clearing after deselect */
export const defaultBrand:  BrandData  = brandSchema.parse({})
export const defaultWeb:    WebData    = webSchema.parse({})
export const defaultApp:    AppData    = appSchema.parse({})
export const defaultRevOps: RevOpsData = revopsSchema.parse({})

export const intakeSchema = z
  .object({
    name:             z.string().min(1, 'Name is required'),
    email:            z.string().email('Valid email required'),
    company:          z.string().default(''),
    role:             z.string().default(''),
    website:          z.string().default(''),
    services:         z.array(serviceTypeEnum).min(1, 'Select at least one service'),
    situation:        z.string().min(1, 'Required'),
    previousAttempts: z.string().default(''),
    decisionMaker:    z.enum(['me', 'partner', 'committee', '']).default(''),
    budget:           z.enum(['u5', '5-15', '15-30', '30-50', '50p', 'ns', '']),
    timeline:         z.enum(['asap', '1-3', '3-6', 'flex', '']),
    anythingElse:     z.string().default(''),
    honeypot:         z.string().default(''),
    brand:            brandSchema.default(() => defaultBrand),
    web:              webSchema.default(() => defaultWeb),
    app:              appSchema.default(() => defaultApp),
    revops:           revopsSchema.default(() => defaultRevOps),
  })
  .superRefine((data, ctx) => {
    if (!data.budget) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Budget is required', path: ['budget'] })
    }
    if (!data.timeline) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Timeline is required', path: ['timeline'] })
    }

    if (data.services.includes('brand')) {
      if (!data.brand.businessDescription.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['brand', 'businessDescription'] })
      if (!data.brand.customerDescription.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['brand', 'customerDescription'] })
      if (!data.brand.competitors.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['brand', 'competitors'] })
      if (!data.brand.personality)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['brand', 'personality'] })
    }

    if (data.services.includes('web')) {
      if (!data.web.primaryJob)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['web', 'primaryJob'] })
      if (!data.web.brokenAndCost.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['web', 'brokenAndCost'] })
    }

    if (data.services.includes('app')) {
      if (!data.app.coreFunction.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['app', 'coreFunction'] })
      if (!data.app.userType)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['app', 'userType'] })
      if (!data.app.specStatus)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['app', 'specStatus'] })
    }

    if (data.services.includes('revops')) {
      if (!data.revops.brokenProcess.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['revops', 'brokenProcess'] })
      if (!data.revops.problemType)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['revops', 'problemType'] })
      if (!data.revops.successAt90Days.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required', path: ['revops', 'successAt90Days'] })
    }
  })

export type IntakeFormData = z.infer<typeof intakeSchema>
export type BrandData      = z.infer<typeof brandSchema>
export type WebData        = z.infer<typeof webSchema>
export type AppData        = z.infer<typeof appSchema>
export type RevOpsData     = z.infer<typeof revopsSchema>

/** Flatten ZodError issues to a dot-notation path → message map */
export function flattenErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (!out[key]) out[key] = issue.message
  }
  return out
}
