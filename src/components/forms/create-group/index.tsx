// import PaymentForm from "./payment-form"

import PaymentForm from "./payment-form"

type Props = {
  userId: string
  affiliate: boolean
  stripeId?: string
}

const CreateGroup = ({ userId, affiliate, stripeId }: Props) => {
  return (
    <PaymentForm userId={userId} affiliate={affiliate} stripeId={stripeId} />
  )
}

export default CreateGroup
