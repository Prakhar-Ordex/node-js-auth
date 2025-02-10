import CertificateCanvas from "../components/CertificateGenrator";

export const Certificate = () => {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-lg    ">
          <h1 className="text-3xl font-bold text-center mb-8">
            Congratulations! You've Passed!
          </h1>
          <CertificateCanvas
            recipientName="John Doe" // Replace with actual user name
            certificationName="Quiz Certification"
            earnedDate={new Date().toLocaleDateString()}
            certificateId={Math.random().toString(36).substr(2, 9)}
            signerName="Quiz Master"
            signerTitle="Chief Quiz Officer"
          />
        </div>
      </div>
    );
  };
  