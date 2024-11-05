type Feature = {
  name: string
  description: string
}

export type PricingTier = {
  name: string
  price: number
  billingCycle: "monthly" | "annually"
  features: Feature[]
}

export const PRICING_TIER: PricingTier[] = [
  {
    name: "Basic",
    price: 9.99,
    billingCycle: "monthly",
    features: [
      {
        name: "Core Functionality",
        description: "Access to essential features",
      },
      { name: "Limited Storage", description: "5GB cloud storage" },
      { name: "Email Support", description: "24/7 email support" },
      { name: "Single User", description: "Access for one user account" },
    ],
  },
  {
    name: "Professional",
    price: 29.99,
    billingCycle: "monthly",
    features: [
      {
        name: "Advanced Features",
        description: "Access to all basic and pro features",
      },
      { name: "Increased Storage", description: "50GB cloud storage" },
      { name: "Priority Support", description: "24/7 email and chat support" },
      { name: "Team Access", description: "Up to 5 user accounts" },
      { name: "API Access", description: "Basic API integration" },
    ],
  },
  {
    name: "Enterprise",
    price: 99.99,
    billingCycle: "monthly",
    features: [
      {
        name: "Full Suite",
        description: "Access to all features ",
      },
      { name: "Unlimited Storage", description: "Unlimited cloud storage" },
      {
        name: "Dedicated Support",
        description: "24/7 email, chat",
      },
      { name: "Unlimited Users", description: "Unlimited user accounts" },
      {
        name: "Advanced API",
        description: "Full API access ",
      },
      {
        name: "Custom Integration",
        description: "Custom integrations and plugins",
      },
      {
        name: "Advanced Analytics",
        description: "Detailed usage analytics",
      },
    ],
  },
]

// type Feature = {
//   name: string;
//   description: string;
// };

// type PricingTier = {
//   name: string;
//   price: number;
//   billingCycle: 'monthly' | 'annually';
//   features: Record<string, boolean>;
// };

// const allFeatures: Feature[] = [
//   { name: "Core Functionality", description: "Access to essential features" },
//   { name: "Cloud Storage", description: "Amount of cloud storage provided" },
//   { name: "Support", description: "Level of customer support" },
//   { name: "User Accounts", description: "Number of user accounts allowed" },
//   { name: "API Access", description: "Level of API access provided" },
//   { name: "Custom Integration", description: "Ability to create custom integrations and plugins" },
//   { name: "Analytics", description: "Level of usage analytics and reporting" },
//   { name: "Beta Features", description: "Access to beta feature releases" },
//   { name: "Dedicated Account Manager", description: "Assigned dedicated account manager" },
//   { name: "SLA", description: "Service Level Agreement provided" },
// ];

// const pricingTiers: PricingTier[] = [
//   {
//     name: "Basic",
//     price: 9.99,
//     billingCycle: "monthly",
//     features: {
//       "Core Functionality": true,
//       "Cloud Storage": true,
//       "Support": true,
//       "User Accounts": true,
//       "API Access": false,
//       "Custom Integration": false,
//       "Analytics": false,
//       "Beta Features": false,
//       "Dedicated Account Manager": false,
//       "SLA": false,
//     },
//   },
//   {
//     name: "Professional",
//     price: 29.99,
//     billingCycle: "monthly",
//     features: {
//       "Core Functionality": true,
//       "Cloud Storage": true,
//       "Support": true,
//       "User Accounts": true,
//       "API Access": true,
//       "Custom Integration": false,
//       "Analytics": true,
//       "Beta Features": false,
//       "Dedicated Account Manager": false,
//       "SLA": false,
//     },
//   },
//   {
//     name: "Enterprise",
//     price: 99.99,
//     billingCycle: "monthly",
//     features: {
//       "Core Functionality": true,
//       "Cloud Storage": true,
//       "Support": true,
//       "User Accounts": true,
//       "API Access": true,
//       "Custom Integration": true,
//       "Analytics": true,
//       "Beta Features": true,
//       "Dedicated Account Manager": true,
//       "SLA": true,
//     },
//   },
// ];

// // Function to get feature details
// const getFeatureDetails = (featureName: string): Feature | undefined => {
//   return allFeatures.find(feature => feature.name === featureName);
// };

// Example usage:
// const basicTierCoreFunc = pricingTiers[0].features["Core Functionality"]; // true
// const basicTierCoreDetails = getFeatureDetails("Core Functionality");
// { name: "Core Functionality", description: "Access to essential features" }
