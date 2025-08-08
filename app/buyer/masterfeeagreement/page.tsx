"use client"
import Head from "next/head"

export default function MasterFeeAgreement() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <Head>
        <title>Master Fee Agreement | CIM Amplify</title>
        <meta name="description" content="Master Fee Agreement for CIM Amplify Services" />
      </Head>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">CIM AMPLIFY MASTER FEE AGREEMENT</h1>
        <p className="text-center text-primary mb-12 font-medium">Effective Upon Buyer Registration on CIM Amplify</p>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-primary/20">
          <section className="mb-8">
            <p className="text-gray-700">
              This Master Fee Agreement (“Agreement”) is entered into by and between <span className="text-primary font-semibold">CIM Amplify</span> (“CIM Amplify”) and the
              undersigned party (“Recipient”), effective upon Recipient’s acceptance of this Agreement during the buyer
              registration process on the CIM Amplify platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">TABLE OF CONTENTS</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li><a href="#section1" className="text-primary hover:underline">Scope</a></li>
              <li><a href="#section2" className="text-primary hover:underline">Definition of Introduce</a></li>
              <li><a href="#section3" className="text-primary hover:underline">Fee Structure</a></li>
              <li><a href="#section4" className="text-primary hover:underline">Definition of Transaction Value</a></li>
              <li><a href="#section5" className="text-primary hover:underline">Payment Terms</a></li>
              <li><a href="#section6" className="text-primary hover:underline">Term</a></li>
              <li><a href="#section7" className="text-primary hover:underline">Reporting Requirement</a></li>
              <li><a href="#section8" className="text-primary hover:underline">Acknowledgment</a></li>
              <li><a href="#section9" className="text-primary hover:underline">Miscellaneous</a></li>
              <li><a href="#section10" className="text-primary hover:underline">Acceptance</a></li>
            </ol>
          </section>

          <section id="section1" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">1. Scope</h2>
            <p className="text-gray-700">
              Recipient acknowledges that CIM Amplify may introduce Recipient to opportunities to acquire businesses
              (“Target Companies”). This Agreement governs the payment of success fees to CIM Amplify in the event
              Recipient completes a transaction involving a Target Company introduced through CIM Amplify.
            </p>
          </section>

          <section id="section2" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">2. Definition of Introduce, Introduced or Introduction</h2>
            <p className="text-gray-700">
              CIM Amplify is a platform where Recipient is invited to learn about a company for sale. For the purpose of this
              agreement, Introduce, Introduced or Introduction means clicking on <strong>"Move to Active"</strong> on the CIM Amplify platform.
            </p>
          </section>

          <section id="section3" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">3. Fee Structure</h2>
            <p className="text-gray-700">
              Recipient agrees to pay CIM Amplify a success fee of <strong>0.5% (50 basis points)</strong> of Transaction Value, payable
              upon the closing of any Transaction. The minimum success fee payable for any Transaction shall be <strong>$60,000 USD</strong>.
            </p>
            <p className="mt-2 font-medium text-primary">Example:</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>$22,000,000 USD transaction → $110,000 USD fee</li>
              <li>$10,000,000 USD transaction → $60,000 USD minimum fee</li>
            </ul>

            <p className="mt-4 font-medium text-primary">Future Fee Changes:</p>
            <p className="text-gray-700">
              In the event of a future fee adjustment, Recipient will be notified via the email address registered with
              CIM Amplify. Current fees can also be found in the FAQ section at <a className="text-blue-600 hover:underline" href="https://www.cimamplify.com/" target="_blank">https://www.cimamplify.com/</a>.
              Any Introduced Target Companies that are “Active” at the time of a fee adjustment will not be subject to that change.
            </p>

            <p className="mt-4 font-medium text-primary">Currency Conversion and Payment:</p>
            <p className="text-gray-700">
              If a Transaction is consummated in a currency other than USD, the value will be converted using the prevailing
              exchange rate on the closing date, published by the U.S. Federal Reserve or a financial institution agreed to by CIM Amplify.
              All fees are payable in U.S. dollars.
            </p>
          </section>

          <section id="section4" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Definition of Transaction Value</h2>
            <p className="text-gray-700">
              “Transaction Value” means the enterprise value of the Target Company as determined at closing, representing the
              total consideration paid or committed by Recipient at closing, including:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Cash, securities, and other consideration paid at closing</li>
              <li>Promissory notes and deferred payments issued at closing</li>
              <li>Assumed seller debt and liabilities</li>
              <li>Fair market value of retained seller equity</li>
              <li>Net cash and debt at closing (enterprise value basis)</li>
              <li>Non-variable future payments (milestones, earnouts, etc.)</li>
            </ul>
            <p className="mt-4 text-primary">Transaction Value explicitly excludes:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Variable earnouts or contingent future payments</li>
              <li>Working capital adjustments post-closing</li>
              <li>Transaction expenses (legal, accounting, financing, etc.)</li>
              <li>Employment/consulting agreements with sellers</li>
              <li>Breakup fees or deposits not applied to purchase price</li>
              <li>Post-closing adjustments</li>
            </ul>
            <p className="mt-4 text-gray-700">
              <strong>Enterprise Value Calculation:</strong> Fee is based on enterprise value (equity + net debt), ensuring the full
              economic value of the business is captured.
            </p>
          </section>

          <section id="section5" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Payment Terms</h2>
            <p className="text-gray-700">
              Fees are due within <strong>30 business days</strong> of the Transaction closing. Late payments will incur a compounding
              <strong>2% interest per 30 days</strong>.
            </p>
          </section>

          <section id="section6" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">6. Term</h2>
            <p className="text-gray-700">This Agreement applies to any Transaction consummated within <strong className="text-primary">24 months</strong> of the initial Introduction.</p>
          </section>

          <section id="section7" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">7. Reporting Requirement</h2>
            <p className="text-gray-700">
              Recipient agrees to notify CIM Amplify in writing within <strong>5 business days</strong> of closing a transaction with an Introduced Target Company. Notification must include:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Closing date</li>
              <li>Transaction Value</li>
            </ul>
            <p className="mt-2 text-primary">
              Email notice to: <a href="mailto:team@cimamplify.com" className="text-blue-600 hover:underline">team@cimamplify.com</a>
            </p>
          </section>

          <section id="section8" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">8. Acknowledgment</h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>Effective upon buyer registration on CIM Amplify</li>
              <li>Fee applies upon Introduction and successful transaction</li>
              <li>CIM Amplify is not a broker-dealer and provides no securities advice</li>
              <li>Fees are due even if another intermediary is involved</li>
            </ul>
          </section>

          <section id="section9" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">9. Miscellaneous</h2>
            <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li><strong>Governing Law:</strong> New York State, without regard to conflict of law principles.</li>
              <li><strong>Entire Agreement:</strong> This document is the entire agreement between the parties.</li>
              <li><strong>Modifications:</strong> Must be in writing and signed by both parties.</li>
            </ul>
          </section>

          <section id="section10" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">10. Acceptance</h2>
            <p className="uppercase font-bold text-primary">
              BY REGISTERING AS A BUYER ON CIM AMPLIFY AND ACCEPTING THIS AGREEMENT, RECIPIENT ACKNOWLEDGES HAVING READ,
              UNDERSTOOD, AND AGREED TO THE TERMS ABOVE.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}