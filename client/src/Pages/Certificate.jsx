import { useEffect, useRef, useState } from "react";
import CertificateCanvas from "../components/CertificateGenrator";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { isLogin } from "../utils/auth";

export const Certificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const certificateRef = useRef(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const dropdownRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDownloadOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const shareUrls = `${window.location.origin}${location.pathname}`;
    setShareUrl(shareUrls);
    if(!id){
      navigate("/*")
    }
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/apis/certificates/${id}`);
        const data = await response.json();

        console.log(data)
        setCert(data);
        if (response.status === 404) {
          navigate("/*")
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [id]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const login = isLogin();
        if (!login) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Copied link")
  };

  const downloadCertificate = (format) => {
    if (certificateRef.current) {
      certificateRef.current.downloadCertificate(format);
    }
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const text = `Check out my certificate for completing ${cert.quizName}!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const addToLinkedInProfile = () => {
    // LinkedIn Add to Profile parameters
    const params = {
      name: cert.quizName,
      organizationName: "Your Organization Name", // Replace with your organization name
      issueYear: new Date(cert.createdDate).getFullYear(),
      issueMonth: new Date(cert.createdDate).getMonth() + 1,
      expirationYear: '', // Optional: Add if certificate expires
      expirationMonth: '', // Optional: Add if certificate expires
      certUrl: shareUrl,
      certId: cert.certificate
    };

    const addProfileUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME
      &name=${encodeURIComponent(params.name)}
      &organizationName=${encodeURIComponent(params.organizationName)}
      &issueYear=${params.issueYear}
      &issueMonth=${params.issueMonth}
      &certUrl=${encodeURIComponent(params.certUrl)}
      &certId=${encodeURIComponent(params.certId)}`;

    window.open(addProfileUrl.replace(/\s+/g, ''), '_blank', 'width=600,height=600');
  };
  const shareToWhatsApp = async () => {
    const text = `Check out my certificate for completing ${cert.quizName}! ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'width=600,height=400');
  };

  const shareToTelegram = async () => {
    const text = `Check out my certificate for completing ${cert.quizName}!`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank', 'width=600,height=400');
  };

  if (!cert || isLoading) return <div>Loading...</div>;
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Certificate Canvas Container */}
        <div className="bg-white rounded-lg p-4 mb-4 overflow-x-auto">
          <div className="min-w-[1000px]">
            <CertificateCanvas
              ref={certificateRef}
              recipientName={cert.name}
              certificationName={cert.quizName}
              earnedDate={new Date(cert.createdDate).toLocaleDateString()}
              certificateId={cert.certificate}
              signerName="Quiz Master"
              signerTitle="Chief Quiz Officer"
              width={ 1000}
              height={700}
            />
          </div>
        </div>

        {/* Sharing Section - Only show if authenticated */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-4">
            <h3 className="font-medium text-lg">Share this Certificate</h3>
            
            {/* Social Buttons */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={shareOnFacebook}
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                onClick={shareOnTwitter}
                className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button 
                onClick={shareOnLinkedIn}
                className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button 
                onClick={shareToWhatsApp}
                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>
              <button 
                onClick={shareToTelegram}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.306.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </button>
            </div>

            {/* URL Section */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Certificate URL</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 border rounded-md text-sm bg-gray-50 w-full"
                />
                <button 
                  onClick={copyToClipboard}
                  className="p-2 border rounded-md hover:bg-green-300 transition-colors whitespace-nowrap text-center flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button 
                onClick={addToLinkedInProfile}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Add to LinkedIn
              </button>
              <div className="relative download-button-container w-full sm:w-auto" ref={dropdownRef}>
                {/* Dropdown Menu - Positioned above the button */}
                {showDownloadOptions && (
                  <div 
                    className="absolute z-50 bottom-full mb-2
                      sm:right-0 sm:left-auto left-1/2 -translate-x-1/2 sm:translate-x-0
                      w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 
                      backdrop-blur-sm backdrop-filter"
                  >
                    <div className="py-1 rounded-lg bg-white/90" role="menu">
                      {/* Download as PNG Option */}
                      <button
                        onClick={() => {
                          downloadCertificate('png');
                          setShowDownloadOptions(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        role="menuitem"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4 4 4-4m0 0v-14m-4 4h6m-6 4h6m6 0v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8"/>
                        </svg>
                        Download as PNG
                      </button>
                      
                      {/* Divider */}
                      <div className="h-px bg-gray-200 mx-4"></div>
                      
                      {/* Download as PDF Option */}
                      <button
                        onClick={() => {
                          downloadCertificate('pdf');
                          setShowDownloadOptions(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        role="menuitem"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        Download as PDF
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Download Button */}
                <button 
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Certificate
                  <svg 
                    className={`w-4 h-4 ml-1 transform transition-transform ${showDownloadOptions ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
