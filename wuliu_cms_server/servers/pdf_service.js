"use strict";

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const LOGO_PATH = path.join(__dirname, '../public/dist/img/logo_58.0dc6dc66.png');

class PdfService {
    constructor() {
        this.doc = null;
        this.pageWidth = 595.28;
        this.pageHeight = 841.89;
        this.margin = 50;
        this.contentWidth = this.pageWidth - this.margin * 2;
        this.currentY = 0;
    }

    async generateQuotationPdf(quotation) {
        return new Promise((resolve, reject) => {
            this.doc = new PDFDocument({
                size: 'A4',
                margin: this.margin,
                info: {
                    Title: `Quotation - ${quotation.auction_ref}`,
                    Author: 'MBE Fine Art Shipping',
                    Subject: 'Quotation',
                    Keywords: 'quotation, shipping, fine art'
                }
            });

            const chunks = [];
            this.doc.on('data', (chunk) => chunks.push(chunk));
            this.doc.on('end', () => resolve(Buffer.concat(chunks)));
            this.doc.on('error', reject);

            this.currentY = this.margin;
            this.drawHeader(quotation);
            this.drawCompanyInfo();
            this.drawCustomerInfo(quotation);
            this.drawAuctionInfo(quotation);
            this.drawCostDetails(quotation);
            this.drawTerms();
            this.drawSignatureSection();
            this.drawFooter();

            this.doc.end();
        });
    }

    drawHeader(quotation) {
        if (fs.existsSync(LOGO_PATH)) {
            this.doc.image(LOGO_PATH, this.margin, this.currentY, { width: 80 });
        }

        this.doc.fontSize(20).font('Helvetica-Bold');
        this.doc.text('QUOTATION', this.margin + 100, this.currentY + 10, {
            width: this.contentWidth - 100,
            align: 'right'
        });

        this.doc.fontSize(12).font('Helvetica');
        this.doc.text(`Ref: ${quotation.auction_ref}`, this.margin + 100, this.currentY + 40, {
            width: this.contentWidth - 100,
            align: 'right'
        });

        this.doc.text(`Date: ${moment().format('DD/MM/YYYY')}`, this.margin + 100, this.currentY + 58, {
            width: this.contentWidth - 100,
            align: 'right'
        });

        this.currentY += 90;
        this.drawLine();
    }

    drawCompanyInfo() {
        this.doc.fontSize(11).font('Helvetica-Bold');
        this.doc.text('MBE Fine Art Shipping Ltd', this.margin, this.currentY);
        this.doc.fontSize(10).font('Helvetica');
        this.doc.text('Email: info@mbefineartshipping.com', this.margin, this.currentY + 18);
        this.currentY += 40;
    }

    drawCustomerInfo(quotation) {
        const data = quotation.data || {};

        this.doc.fontSize(12).font('Helvetica-Bold');
        this.doc.text('Customer Information', this.margin, this.currentY);
        this.currentY += 20;
        this.drawLine();
        this.currentY += 10;

        this.drawTwoColumn('Receiver Name:', data.receivers_name || '-',
            'Company Name:', data.company_name || '-');

        this.drawTwoColumn('Email:', data.email || '-',
            'Phone:', data.phone_number || '-');

        this.drawTwoColumn('Destination Country:', data.destination_country || '-',
            '', '');

        this.currentY += 5;
        this.doc.fontSize(10).font('Helvetica-Bold');
        this.doc.text('Shipping Address:', this.margin, this.currentY);
        this.doc.fontSize(10).font('Helvetica');
        this.doc.text(data.shipping_address || '-', this.margin + 100, this.currentY, {
            width: this.contentWidth - 100
        });

        this.currentY += 40;
    }

    drawAuctionInfo(quotation) {
        const data = quotation.data || {};

        this.doc.fontSize(12).font('Helvetica-Bold');
        this.doc.text('Auction Information', this.margin, this.currentY);
        this.currentY += 20;
        this.drawLine();
        this.currentY += 10;

        this.drawTwoColumn('Auction Name:', data.auction_name || '-',
            'Auction Date:', data.auction_date ? moment(data.auction_date).format('DD/MM/YYYY') : '-');

        this.drawTwoColumn('Auction Ref:', data.auction_ref || '-',
            'Lots Involved:', data.lots_involved || '-');

        this.drawTwoColumn('Total Value:', data.total_value || '-',
            'Packing Type:', data.packing_method || '-');

        this.drawTwoColumn('Shipping Method:', data.shipping_method || '-',
            '', '');

        this.currentY += 20;
    }

    drawCostDetails(quotation) {
        const data = quotation.data || {};

        this.doc.fontSize(12).font('Helvetica-Bold');
        this.doc.text('Cost Details', this.margin, this.currentY);
        this.currentY += 20;
        this.drawLine();
        this.currentY += 10;

        const tableTop = this.currentY;
        const col1Width = 300;
        const col2Width = 100;
        const col3Width = 100;

        this.doc.rect(this.margin, tableTop, this.contentWidth, 20).stroke();
        this.doc.fontSize(10).font('Helvetica-Bold');
        this.doc.text('Description', this.margin + 5, tableTop + 5);
        this.doc.text('Currency', this.margin + col1Width + 5, tableTop + 5);
        this.doc.text('Amount', this.margin + col1Width + col2Width + 5, tableTop + 5, {
            width: col3Width - 10,
            align: 'right'
        });

        let rowY = tableTop + 20;
        const rowHeight = 25;

        this.doc.rect(this.margin, rowY, this.contentWidth, rowHeight).stroke();
        this.doc.fontSize(10).font('Helvetica');
        this.doc.text('Cost of Packing and Shipping', this.margin + 5, rowY + 7);
        this.doc.text('GBP', this.margin + col1Width + 5, rowY + 7);
        this.doc.text(data.packing_shipping_GBP || '0.00', this.margin + col1Width + col2Width + 5, rowY + 7, {
            width: col3Width - 10,
            align: 'right'
        });

        rowY += rowHeight;
        this.doc.rect(this.margin, rowY, this.contentWidth, rowHeight).stroke();
        this.doc.text('Cost of Additional Cover', this.margin + 5, rowY + 7);
        this.doc.text('GBP', this.margin + col1Width + 5, rowY + 7);
        this.doc.text(data.additional_GBP || '0.00', this.margin + col1Width + col2Width + 5, rowY + 7, {
            width: col3Width - 10,
            align: 'right'
        });

        rowY += rowHeight;
        this.doc.rect(this.margin, rowY, this.contentWidth, rowHeight).stroke();
        this.doc.fontSize(10).font('Helvetica-Bold');
        this.doc.text('Total Payment Due (GBP)', this.margin + 5, rowY + 7);
        this.doc.text('GBP', this.margin + col1Width + 5, rowY + 7);
        this.doc.text(data.total_payment_GBP || '0.00', this.margin + col1Width + col2Width + 5, rowY + 7, {
            width: col3Width - 10,
            align: 'right'
        });

        rowY += rowHeight + 5;
        this.doc.fontSize(10).font('Helvetica');
        this.doc.text('* Including compensation up to a maximum of £75 per consignment', this.margin, rowY);

        rowY += 20;
        this.doc.fontSize(10).font('Helvetica-Bold');
        this.doc.text('Equivalent in other currencies:', this.margin, rowY);

        rowY += 18;
        this.drawTwoColumn('USD:', data.total_payment_USD || '0.00',
            'EUR:', data.total_payment_EUR || '0.00');

        this.drawTwoColumn('AUD:', data.total_payment_AUD || '0.00',
            '', '');

        this.currentY = rowY + 20;
    }

    drawTerms() {
        if (this.currentY > 650) {
            this.doc.addPage();
            this.currentY = this.margin;
        }

        this.doc.fontSize(12).font('Helvetica-Bold');
        this.doc.text('Terms and Conditions', this.margin, this.currentY);
        this.currentY += 20;
        this.drawLine();
        this.currentY += 10;

        this.doc.fontSize(9).font('Helvetica');
        this.doc.text(
            'By accepting our quotation and instructing us to proceed with this Shipping Order, you, the Customer, ' +
            'authorise us, the Company, to charge any and all of the charges specified on this Shipping Order and/or ' +
            'costs including penalties arising in the event of non-payment of the Consignee. You have read the ' +
            'Terms and Conditions and agree to abide by them.',
            this.margin, this.currentY, {
                width: this.contentWidth,
                align: 'justify'
            }
        );

        this.currentY += 50;
    }

    drawSignatureSection() {
        if (this.currentY > 700) {
            this.doc.addPage();
            this.currentY = this.margin;
        }

        this.doc.fontSize(12).font('Helvetica-Bold');
        this.doc.text('Authorised Signature', this.margin, this.currentY);
        this.currentY += 20;
        this.drawLine();
        this.currentY += 10;

        const sigWidth = 220;
        const sigHeight = 60;

        this.doc.rect(this.margin, this.currentY, sigWidth, sigHeight).stroke();
        this.doc.rect(this.margin + sigWidth + 50, this.currentY, sigWidth, sigHeight).stroke();

        this.doc.fontSize(10).font('Helvetica');
        this.doc.text('Customer Signature:', this.margin, this.currentY + sigHeight + 5);
        this.doc.text('Company Representative:', this.margin + sigWidth + 50, this.currentY + sigHeight + 5);

        this.currentY += sigHeight + 30;

        this.doc.rect(this.margin, this.currentY, sigWidth, 25).stroke();
        this.doc.rect(this.margin + sigWidth + 50, this.currentY, sigWidth, 25).stroke();

        this.doc.fontSize(10).font('Helvetica');
        this.doc.text('Date:', this.margin, this.currentY + 7);
        this.doc.text('Date:', this.margin + sigWidth + 50, this.currentY + 7);

        this.currentY += 50;
    }

    drawFooter() {
        const pageCount = this.doc.bufferedPageRange ? this.doc.bufferedPageRange().count : 1;
        for (let i = 0; i < pageCount; i++) {
            this.doc.switchToPage(i);
            this.doc.fontSize(8).font('Helvetica');
            this.doc.text(
                'MBE Fine Art Shipping Ltd - Professional Art Shipping Services',
                this.margin,
                this.pageHeight - 30,
                { width: this.contentWidth, align: 'center' }
            );
            this.doc.text(
                `Page ${i + 1} of ${pageCount}`,
                this.margin,
                this.pageHeight - 20,
                { width: this.contentWidth, align: 'center' }
            );
        }
    }

    drawTwoColumn(label1, value1, label2, value2) {
        const colWidth = (this.contentWidth - 20) / 2;

        this.doc.fontSize(10).font('Helvetica-Bold');
        this.doc.text(label1, this.margin, this.currentY, { width: 100 });
        this.doc.fontSize(10).font('Helvetica');
        this.doc.text(value1, this.margin + 100, this.currentY, { width: colWidth - 100 });

        if (label2) {
            this.doc.fontSize(10).font('Helvetica-Bold');
            this.doc.text(label2, this.margin + colWidth + 20, this.currentY, { width: 100 });
            this.doc.fontSize(10).font('Helvetica');
            this.doc.text(value2, this.margin + colWidth + 120, this.currentY, { width: colWidth - 100 });
        }

        this.currentY += 22;
    }

    drawLine() {
        this.doc.moveTo(this.margin, this.currentY)
            .lineTo(this.pageWidth - this.margin, this.currentY)
            .stroke();
        this.currentY += 5;
    }
}

module.exports = new PdfService();
