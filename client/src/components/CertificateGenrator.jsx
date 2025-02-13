import React, { forwardRef, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import companyLogo from '../asset/logo.png'

const CertificateCanvas = forwardRef(({
  recipientName = "Prakhar Tripathi",
  certificationName = "JavaScript (Basic)",
  earnedDate = "20 Jan, 2025",
  certificateId = "A4618D17D1FF",
  signerName = "Harishankaran K",
  signerTitle = "CTO, HackerRank",
  width = 1000,
  height = 700,
  // companyLogo = null ,// New prop for company logo
  // signatureImage = null 
}, ref) => {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const signatureRef = useRef(null);

  const loadLogo = () => {
    return new Promise((resolve, reject) => {
      if (!companyLogo) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => {
        logoRef.current = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = companyLogo;
    });
  };
  const signatureLogo = () => {
    return new Promise((resolve, reject) => {
      if (!companyLogo) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => {
        signatureRef.current = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = companyLogo;
    });
  };

  const drawCertificate = async (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Draw decorative background pattern
    ctx.save();
    ctx.strokeStyle = '#f0f0f0';
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw diagonal lines pattern
    for (let i = 0; i < 360; i += 15) {
      ctx.beginPath();
      const radius = Math.max(width, height);
      const angle = (i * Math.PI) / 180;
      ctx.moveTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.lineTo(
        centerX - Math.cos(angle) * radius,
        centerY - Math.sin(angle) * radius
      );
      ctx.stroke();
    }

    // Draw concentric diamond shapes
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      const size = 600 - i * 60;
      ctx.moveTo(centerX, centerY - size/2);
      ctx.lineTo(centerX + size/2, centerY);
      ctx.lineTo(centerX, centerY + size/2);
      ctx.lineTo(centerX - size/2, centerY);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();

    // Add subtle border
    ctx.save();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    const margin = 40;
    ctx.strokeRect(margin, margin, width - 2*margin, height - 2*margin);
    ctx.restore();

    // Draw company logo if provided
    if (logoRef.current) {
      const logoSize = 115;
      const aspectRatio = logoRef.current.width / logoRef.current.height;
      const logoWidth = aspectRatio >= 1 ? logoSize : logoSize * aspectRatio;
      const logoHeight = aspectRatio >= 1 ? logoSize / aspectRatio : logoSize;
      
      ctx.drawImage(
        logoRef.current,
        width/2 - logoWidth/2,
        50,
        logoWidth,
        logoHeight
      );
    }

    // Draw main title
    ctx.font = 'bold 44px serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Accomplishment', width/2, 200);

    // Draw certification name banner
    ctx.save();
    ctx.translate(width/2, 270);
    ctx.fillStyle = '#1a1a1a';
    
    // Banner shape
    ctx.beginPath();
    ctx.moveTo(-210, -20);
    ctx.lineTo(210, -20);
    ctx.lineTo(230, 20);
    ctx.lineTo(-190, 20);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(certificationName, 0, 8);
    ctx.restore();

    // Draw "PRESENTED TO"
    ctx.font = '20px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText('PRESENTED TO', width/2, 350);

    // Draw recipient name
    ctx.font = 'italic 36px serif';
    ctx.fillStyle = 'black';
    ctx.fillText(recipientName, width/2, 400);

    // Draw description
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText('The bearer of this certificate has passed the skill certification test', 
      width/2, 450);

    // Draw bottom information
    ctx.textAlign = 'left';
    ctx.fillText(`Earned on: ${earnedDate}`, 100, 600);
    ctx.fillText(`ID: ${certificateId}`, 100, 630);

      // Draw signature image and details
      if (signatureRef.current) {
        const signatureWidth = 150;
        const signatureHeight = 60;
        ctx.drawImage(
          signatureRef.current,
          width - 250,
          540,
          signatureWidth,
          signatureHeight
        );
      }
    // Draw signature section
    ctx.textAlign = 'right';
    ctx.font = 'italic 20px cursive';
    ctx.fillText(signerName, width - 100, 600);
    ctx.font = '15px Arial';
    ctx.fillText(signerTitle, width - 100, 630);
  };

  const downloadCertificate = async (format = 'png') => {
    const canvas = canvasRef.current;
    
    if (format === 'png') {
      // Download as PNG
      const link = document.createElement('a');
      link.download = `certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else if (format === 'pdf') {
      try {
        // Create PDF with proper dimensions
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [width, height]
        });
        
        // Add the canvas image to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save('certificate.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  useEffect(() => {
    const initCanvas = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // For better resolution on high DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      await loadLogo();
      await signatureLogo();
      await drawCertificate(ctx);
    };

    initCanvas();
  }, [width, height, recipientName, certificationName, earnedDate, certificateId, signerName, signerTitle, companyLogo]);

  // Expose the download function via ref
  useEffect(() => {
    if (ref) {
      ref.current = {
        downloadCertificate
      };
    }
  }, [ref]);

  return (
    <div className=" items-center gap-4 ">
      <canvas 
        ref={canvasRef}
        className="shadow-lg"
      />
      <div>
    
      </div>
      {/* <button
        onClick={downloadCertificate}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Download Certificate
      </button> */}
    </div>
  );
});

export default CertificateCanvas;