import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Seller } from '../hooks/useSeller';

export const generateSellerPDF = (seller: Seller) => {
    // Cast to any first to avoid type conflicts, then to intersection
    const doc = new jsPDF() as any;
    // Or better, just use any for the library extension part if types are fighting
    // const doc: any = new jsPDF();


    // Sanitize text
    const cleanText = (text: string | undefined) => {
        if (!text) return '';
        return text.replace(/[^\x20-\x7E\n\r]/g, '').trim();
    };

    // --- Header ---
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SELLER APPLICATION FORM', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32); // Horizontal line

    // Shared table styles for "Professional Form" look
    const tableStyles = {
        theme: 'grid' as const,
        headStyles: {
            fillColor: [220, 220, 220] as [number, number, number], // Light gray header
            textColor: [0, 0, 0] as [number, number, number],      // Black text
            fontStyle: 'bold' as const,
            lineWidth: 0.1,
            lineColor: [80, 80, 80] as [number, number, number]
        },
        bodyStyles: {
            textColor: [0, 0, 0] as [number, number, number],
            lineWidth: 0.1,
            lineColor: [80, 80, 80] as [number, number, number]
        },
        styles: {
            font: 'helvetica',
            overflow: 'linebreak' as const,
            cellPadding: 4,
            fontSize: 10
        }
    };

    // --- Section 1: Personal & Business Details ---
    autoTable(doc, {
        startY: 40,
        head: [['Personal & Business Information', '']],
        body: [
            ['Seller ID', seller.seller_id],
            ['Full Name', cleanText(seller.name)],
            ['Email Address', seller.email],
            ['Phone Number', cleanText(seller.phone)],
            ['Business Type', seller.seller_type === 'honey' ? 'Honey Producer' : 'Beehive Provider'],
        ],
        ...tableStyles,
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 70 },
            1: { cellWidth: 'auto' }
        },
    });

    const finalY1 = (doc as any).lastAutoTable.finalY;

    // --- Section 2: Location ---
    autoTable(doc, {
        startY: finalY1 + 10,
        head: [['Location Details', '']],
        body: [
            ['Street Address', cleanText(seller.address || 'N/A')],
            ['City', cleanText(seller.city)],
            ['State', cleanText(seller.state)],
            ['Zip / Postal Code', cleanText(seller.zip)],
            ['Geo Coordinates', `${seller.latitude || 'N/A'}, ${seller.longitude || 'N/A'}`],
        ],
        ...tableStyles,
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 70 },
            1: { cellWidth: 'auto' } // Auto width allows wrapping for long addresses
        },
    });

    const finalY2 = (doc as any).lastAutoTable.finalY;

    // --- Section 3: Status & Verification ---
    autoTable(doc, {
        startY: finalY2 + 10,
        head: [['Application Status', '']],
        body: [
            ['Approval Status', seller.is_approved ? 'APPROVED' : 'PENDING REVIEW'],
            ['KYC Verification', seller.kyc_verified ? 'VERIFIED' : 'NOT VERIFIED'],
            ['Application Date', new Date(seller.created_at).toLocaleDateString()],
        ],
        ...tableStyles,
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 70 },
            1: { cellWidth: 'auto' }
        },
    });

    const finalY3 = (doc as any).lastAutoTable.finalY;

    // --- Declaration / Footer ---
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const declarationText = "I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief and I undertake the responsibility to inform about any changes therein immediately.";
    const splitDeclaration = doc.splitTextToSize(declarationText, 180);
    doc.text(splitDeclaration, 14, finalY3 + 15);

    // Bottom Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('© 2026 BeeBridgePlatform. All rights reserved.', 105, pageHeight - 10, { align: 'center' });

    // Save
    doc.save(`Seller_Application_${seller.seller_id}.pdf`);
};
