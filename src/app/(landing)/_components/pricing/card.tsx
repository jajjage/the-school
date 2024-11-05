import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { GROUPLE_CONSTANTS } from "@/constants"
import { Check } from "@/icons"
import Link from "next/link"

type Props = {}

const CardPrice = (props: Props) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {GROUPLE_CONSTANTS.pricingTier.map((priceItem, index) => (
        <Card
          key={index}
          className="p-7 gap-2 mt-10 w-full md:w-auto bg-themeBlack border-themeGray"
        >
          <div className="flex flex-col gap-2">
            <CardTitle>
              {priceItem.price} / {priceItem.billingCycle}
            </CardTitle>
            <CardDescription className="text-[#B4B0AE]">
              Great if you’re just getting started
            </CardDescription>
            <Link href="#" className="w-full mt-3">
              <Button
                variant="default"
                className="bg-[#333337] w-full rounded-2xl text-white hover:text-[#333337]"
              >
                Start for free
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-[#B4B0AE] mt-5">
            {priceItem.features.map((Item, featureIndex) => (
              <div key={featureIndex} className="flex gap-2 mt-3 items-center">
                <Check />
                <span>
                  {Item.name}: {Item.description}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default CardPrice
