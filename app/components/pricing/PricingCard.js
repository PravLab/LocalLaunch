// // components/PricingCard.js
// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import usePlanHandler from "@/hooks/usePlanHandler";

// export default function PricingCard({ plan }) {
//   const { handleClick, loadingPlan } = usePlanHandler();

//   return (
//     <Card className="p-4 w-full">
//       <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
//       <p>{plan.description}</p>
//       <Button
//         onClick={() => handleClick(plan.id)}
//         disabled={loadingPlan === plan.id}
//         className="mt-4"
//       >
//         {loadingPlan === plan.id ? "Loading..." : "Choose Plan"}
//       </Button>
//     </Card>
//   );
// }
// // 