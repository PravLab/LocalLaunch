import RegisterWizard from "@/app/components/register-wizard/RegisterWizard";
// import RegisterWrapper from "@/app/components/register-wizard/RegisterWrapper";

export const metadata = {
  title: "Create Your Free Business Website | Local Launch",
  description: "Register your local business and launch a beautiful online store in minutes. Free, simple, and powerful!",
};

export default function RegisterPage() {
  return (
      <RegisterWizard />
    // <RegisterWrapper>
    // </RegisterWrapper>
  );
}
