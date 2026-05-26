// app/terms/page.jsx
import Link from "next/link";
import {
  Shield,
  FileText,
  Scale,
  AlertCircle,
  Mail,
  MapPin,
  Globe,
  Database,
  RefreshCw,
  Lock,
  Users,
  TrendingUp,
  Briefcase,
  CheckCircle,
  XCircle,
  Info,
  BookOpen,
  Award,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service | The Fast Bill",
  description:
    "Read the official Fast Bill Terms of Service covering user responsibilities, billing policies, privacy, subscriptions, intellectual property, cancellations, and legal conditions for using Fast Bill software and services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            {/* Acceptance of Terms */}
           
              <p>
               The Fast Bill app (for your phone and computer) and website are created and managed by Leelija Web Solutions Private Limited. This company, with CIN number U72900WB2019PTC230773, is officially registered in India and is located at Taki Road, Bamunmura, Barasat, Kolkata - 700125, West Bengal. “User” or “You” used in these Terms of Service refers to any individual, company, or legal entity using Fast Bill’s app, website, or services.
              </p>
              <p className="mt-3">
                By accessing the Fast Bill platform or using the Services
                offered by the Fast Bill, and purchasing any paid subscription
                plans from the Fast Bill, you agree to abide by all the stated
                terms, conditions, and policies. When you use the Fast Bill app,
                website, or any of its services, you agree to follow our rules.
                By using the Fast Bill platform, you agree to automatically
                accept all these Terms of Service, along with any other related
                Policies.
              </p>
              <p className="mt-3">
                By using the Fast Bill app, website, or service, you agree to
                follow the official rules. This includes, without limitation,
                our specific guidelines on privacy, Trial, Service Cancellation,
                Referral or Policy, usage, cancellations, and referrals.
              </p>
              <p className="mt-3">
                These rules apply to everyone who uses the Fast Bill. Whether
                you use our mobile app, computer app, website, or any other
                services, these rules and guidelines apply to you. The only
                exception is if we have a separate writer agreement with you
                that says otherwise.
              </p>
              <p className="mt-3">
                We urge you to kindly go through these Terms of Service
                carefully before using any of Fast Bill's services or accessing
                its apps or websites. By using our apps and services, you
                automatically agree to follow these rules. If you do not agree
                with these Terms of Service, you will not be able to access any
                of our apps, websites, or services. These rules are the only
                terms that apply. We only accept changes to these rules if we
                agree to them in writing.
              </p>
              <p className="mt-3">
                Any new tools, paid plans, or services the Fast Bill adds are
                automatically covered by these same rules. The Fast Bill can
                change these Terms of Service at any time. You can always read
                the updated version on the Fast Bill Terms of Service page. It
                is up to you to check the page now and then to see if anything
                has been altered, added, or edited. If you keep using the app or
                website after we change the rules, it means you agree to the new
                rules.
              </p>
          

            {/* Privacy Policy */}
            <Section title="Privacy Policy" icon={<Lock className="w-5 h-5" />}>
              <p>
                Our Terms of Service include our Privacy Policy, which explains
                how we handle your personal information. By using the Fast Bill,
                you agree to these rules and confirm that the information you
                give us is accurate and true.
              </p>
            </Section>

            {/* About Us */}
            <Section title="About Us" icon={<Briefcase className="w-5 h-5" />}>
              <p>
                The Fast Bill app or website lets you easily generate
                professional GST bills, keep track of your sales, expenses, and
                business profits, manage your stocks, online accounts, and store
                services through mobile, desktop app, website, and Store.
              </p>
            </Section>

            {/* Definitions */}
            <Section
              title="Definitions"
              icon={<BookOpen className="w-5 h-5" />}
            >
              <p>
                Terms that are capitalized but not defined elsewhere in these
                Terms of Service shall mean as follows:
              </p>
              <div className="mt-4 space-y-4">
                <DefinitionTerm term="Additional terms">
                  are the terms and conditions you must follow when you download
                  and use the app from places like the Apple App Store, the
                  Google Play Store, or any other website. These are simply Fast
                  Bill's own guidelines that apply to you while using the
                  above-mentioned platforms.
                </DefinitionTerm>
                <DefinitionTerm term="Applicable laws">
                  refer to all the legal rules and decisions that you must
                  follow. These include all laws, acts, rules, regulations, and
                  guidelines created by any government or official authority.
                  However, these also include any official judgments, orders,
                  directions, or legal agreements made by a court, a government
                  official, or a recognized stock exchange.
                </DefinitionTerm>
                <DefinitionTerm term="Legal terms">
                  like international tax treaties may be in force from time to
                  time. These are special agreements between different countries
                  that decide how taxes are handled when business or money
                  crosses borders, whenever those rules are active. The
                  "content" is anything you post or share on Fast Bill. This
                  includes your product lists, prices, descriptions, and any
                  other files you upload. The "Desktop Application" refers to
                  any computer program made by Fast Bill that you use to access
                  its services. "Governmental Authority" is any official
                  government group, court, or regulatory board in India or any
                  other country. "Fees" refer to the amount of money the Fast
                  Bill charges you to use its Services. "Fast Bill Products"
                  means the different tools and platforms the Fast Bill provides
                  you with, such as the mobile app, desktop app, online store,
                  and website.
                </DefinitionTerm>
                <DefinitionTerm term="Intellectual Property Rights">
                  means: the ownership of patents, formulas, designs, trade
                  secrets, and "know-how" Rights to the company name, service
                  name, logos, brand symbols, and internet domain names The
                  ownership of software, literary/artistic works, databases, and
                  moral rights Any permissions, legal contracts, or agreements
                  that allow us to manage or share our ownership of these
                  creations These rights apply now and into the future, no
                  matter what part of the world you are in, and whether you are
                  formally registered or not. By agreeing to these Terms of
                  Service, you agree that it legally guarantees the Fast Bill
                  and only the Fast Bill has the right to benefit from our
                  original ideas, inventions, and brand. Please note that the
                  Fast Bill authority has the sole right to sue any user or
                  company that would steal or misuse our Intellectual Property.
                </DefinitionTerm>
                <DefinitionTerm term="Mobile Application">
                  refers to the mobile application developed by Fast Bill for
                  availing the Services offered.
                </DefinitionTerm>
                <DefinitionTerm term="Person">
                  shall mean any regular human, as well as businesses, groups,
                  families, and government bodies that the applicable law treats
                  as a Person.
                </DefinitionTerm>
                <DefinitionTerm term="Services">
                  shall mean the invoicing and stock/inventory management
                  services, or tools that Fast Bill provides you with for
                  business management, like billing, accounting, and online
                  store features. You can avail these on the mobile or computer
                  app, and the Fast Bill website.
                </DefinitionTerm>
                <DefinitionTerm term="Store">
                  refers to the online web page created for you by Fast Bill,
                  where you can look at our products, buy them, and make
                  payments.
                </DefinitionTerm>
                <DefinitionTerm term="Website">
                  means any web page or internal link provided by Fast Bill to
                  help you use our tools and Services.
                </DefinitionTerm>
              </div>
            </Section>

            {/* Changes to the Terms of Service */}
            <Section
              title="Changes to the Terms of Service"
              icon={<RefreshCw className="w-5 h-5" />}
            >
              <p>
                The Fast Bill can update the rules whenever we want by updating
                this page, the Fast Bill Terms of Service. It is your
                responsibility to check the page occasionally to stay updated,
                as the new rules will apply to you.
              </p>
              <p className="mt-3">
                The Fast Bill can add, remove, or change the services, features,
                or apps without telling you first. We also have the right to
                limit how long you can use our Services or completely stop
                providing you with certain features.
              </p>
            </Section>

            {/* Acceptance of the Terms of Service */}
            <Section
              title="Acceptance of the Terms of Service"
              icon={<CheckCircle className="w-5 h-5" />}
            >
              <p>
                By using the Fast Bill, you agree to the rules mentioned in
                these Terms of Service. If you do not agree, please do not use
                the app or create an account on any of the Fast Bill platforms.
              </p>
              <p className="mt-3">
                The Fast Bill gives you permission to install and use its
                software for your business, but this is strictly for you only.
                You are not allowed to share it with others or copy the
                software.
              </p>
              <p className="mt-3">
                The Fast Bill permits you to use its app and any materials they
                own. However, the permission is just for you, which is
                non-transferable, and you cannot share it with others. If you
                want to use third-party content or software not owned by Fast
                Bill, you must get permission directly from the original owner.
                The Fast Bill's rules do not cover these third-party items. You
                must follow the rules set by the third-party owner.
              </p>
            </Section>

            {/* Conditions for Use */}
            <Section
              title="Conditions for Use"
              icon={<Users className="w-5 h-5" />}
            >
              <p>
                By accepting these rules, you promise that you are at least 18
                years old and legally allowed to make agreements. If you are
                signing up for a company or business, you promise that the
                business has given you official permission to agree to these
                terms on their behalf. By using the Fast Bill, you promise that
                you are legally allowed to agree to these rules. If you are
                using these services for a company or business, you promise that
                you have the authority to agree to these rules on their behalf,
                making the business legally bound to them.
              </p>
              <p className="mt-3">
                If the Fast Bill changes the rules for who can use its Service,
                and you no longer fit these new rules, they have the right to
                block or suspend your account. You agree that they will not owe
                you anything if this happens. It is entirely your responsibility
                to make sure you always follow the rules.
              </p>
              <p className="mt-3">
                When you use the Fast Bill, you must follow the general Terms of
                Service, but you also need to follow any Additional Terms or
                Software Rules that apply to any service you register for or pay
                for. If there are ever two rules that do not match, the main
                Terms of Service will always prevail.
              </p>
              <p className="mt-3">
                You agree to install the latest updates for the Fast Bill app
                and your device when asked, so the software works perfectly.
              </p>
              <p className="mt-3">
                You agree to help and cooperate with the Fast Bill team if they
                need to connect the system with your business tools or devices
                to provide you with the best service.
              </p>
              <p className="mt-3">
                You must keep the devices you use to access the Fast Bill (your
                computer or phone) secure and protected from hackers. If someone
                gets access to your information because your device was not
                secure, you are fully responsible for it.
              </p>
            </Section>

            {/* Availability of the Services and the Fast Bill Products */}
            <Section
              title="Availability of the Services and the Fast Bill Products"
              icon={<Globe className="w-5 h-5" />}
            >
              <p>
                You must follow the law when using the Fast Bill. You cannot use
                it for anything illegal or to steal other people's work. If you
                break these rules for any other reason, the Fast Bill can stop
                providing services to you at any time.
              </p>
              <p className="mt-3">
                Some features on the Fast Bill cost money. You agree to pay the
                price displayed on the app or website to use it. To make your
                payments, the Fast Bill uses trusted banks and payment partners.
                You agree to follow its specific rules and payment terms when
                you pay your fees. If the Fast Bill and its partners cannot
                automatically collect your payment or a technical glitch takes
                place, you promise to pay us directly and quickly. If you still
                do not pay, the Fast Bill can stop your access to its paid
                features and Services.
              </p>
              <p className="mt-3">
                The cost of the Services or Products offered by Fast Bill can go
                up or down. If any changes in the pricing plan take place, the
                Fast Bill team will let you know. If you keep using the Fast
                Bill after the price goes up, it means you agree to pay the
                revised price.
              </p>
              <p className="mt-3">
                You, as a user, agree to promptly update your current profile
                details, like email, phone number, personal and payment details,
                whenever anything changes. Provide the Fast Bill with any
                documents and information they ask for so you can keep using its
                services.
              </p>
              <p className="mt-3">
                To use the Fast Bill, you need to create an account on the
                official website https://thefastbill.com/ and provide basic
                details like your login and password. If you provide false
                information or leave out important details, the Fast Bill
                reserves all rights to suspend your account and stop you from
                using any Services offered by the Fast Bill.
              </p>
              <p className="mt-3">
                You give the Fast Bill permission to view and use all the data
                and business details you put into its app. The Fast Bill team
                can securely store, transfer, process, and utilize your details
                on the servers to keep the app running smoothly for you. The
                Fast Bill will only use this information to provide you with the
                billing and accounting services. Even if you have signed up for
                a "Do Not Disturb" or " Do Not Call" list to block spam, you
                still give Fast Bill permission to contact you. The Fast Bill &
                its partners can reach out via email, phone, or text message to
                tell you about the Services and special offers.
              </p>
            </Section>

            {/* Restrictions on the Use of the Fast Bill Products */}
            <Section
              title="Restrictions on the Use of the Fast Bill Products"
              icon={<XCircle className="w-5 h-5" />}
            >
              <p>
                The Fast Bill provides tools and services for you to use. By
                using them, you agree to follow all the Fast Bill rules, app,
                store guidelines, and the law.
              </p>
              <p className="mt-3">
                To use the Fast Bill, you must have a working phone or computer,
                electricity, and the internet. You are entirely responsible if
                the app does not work because your device is broken, your
                internet goes down, or you lose power.
              </p>
              <p className="mt-3">
                You must keep your account, username, and password safe and
                secure. You are the only one who owns your password. If anyone
                else gets access to your account or password, you are
                responsible for what happens. If your username or password is
                lost, stolen, hacked, or no longer secure, you must contact Fast
                Bill right away. As soon as you tell Fast Bill about the issue,
                they will lock your account to keep it safe.
              </p>
              <p className="mt-3">
                You can not share, sell, rent, or transfer the Fast Bill app or
                its features to anyone else. To do any of these things, you must
                get written permission from the Fast Bill first. To ensure you
                stay compliant, you can review the entire Fast Bill Terms of
                Service for more details on acceptable use.
              </p>
              <p className="mt-3">
                You can only use the Fast Bill for what it is allowed. You must
                not try to access parts of the app or account data you shouldn't
                see. Also, you cannot ask other people for their passwords or
                give your account to anyone else.
              </p>
              <p className="mt-3">
                You are not allowed to hack, remove, or break the app's security
                and rules. Do not hide, change, or delete any copyright or
                ownership notices. Do not use the Fast Bill app in a way that
                could crash it, slow it down, or cause problems for other users.
              </p>
              <p className="mt-3">
                You are not allowed to use the Fast Bill app or services to
                break the law, harm others, or display, upload, modify, publish,
                distribute, disseminate, transmit, update, or share any
                information that:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>
                  attacks or discriminates against people based on race,
                  ethnicity, or background;
                </li>
                <li>sexually explicit;</li>
                <li>targets and harms children;</li>
                <li>
                  spreads fake rumors or insults that ruin someone's reputation;
                </li>
                <li>
                  promotes gambling, money laundering, or other unlawful acts;
                </li>
                <li>
                  spies or shares private information about someone else without
                  their written permission;
                </li>
                <li>
                  is a corrupted file, software, or code designed to damage
                  websites or devices;
                </li>
                <li>
                  is, by nature, ad, junk mail, chain letters, surveys, or
                  pyramid schemes;
                </li>
                <li>
                  false representation of other people's work or software;
                </li>
                <li>is illegal;</li>
                <li>
                  defames or interferes with or disrupts the Fast Bill Services
                  website, server, app, or networks;
                </li>
                <li>impersonate any other person;</li>
                <li>
                  is derogatory, false, or damaging to the Fast Bill team or its
                  partners on social media or anywhere else;
                </li>
                <li>
                  threatens the security or peace of India or insults other
                  nations.
                </li>
              </ul>
              <p className="mt-3">
                You, as a user, agree that you will not attempt to or engage in
                any activity that may:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>
                  break apart or extract the software's underlying code unless
                  the Fast Bill gives you written permission or the law says you
                  can do so;
                </li>
                <li>
                  use bots, spiders, or automated tools to scan and copy pages
                  from the Fast Bill platform;
                </li>
                <li>
                  enable you to collect personal data about other Users for any
                  illegal or unlawful purpose;
                </li>
                <li>use robots or fake info to create user accounts;</li>
                <li>
                  send viruses, worms, or anything else that can harm computers
                  or systems;
                </li>
                <li>
                  damage, slow down, or overload the servers and networks;
                </li>
                <li>
                  stop other people from using and enjoying the app or the
                  website;
                </li>
                <li>
                  launch attacks (like DoS, DDoS) & crash the Fast Bill app;
                </li>
                <li>hack into the system;</li>
                <li>lead to a data breach.</li>
              </ul>
              <p className="mt-3">
                Do not use the Fast Bill for anything illegal, to break the
                rules, or to harm the company's reputation. Do not use the Fast
                Bill app to commit fraud or illegal activities. By agreeing to
                these Terms of Service, you agree to obey all business
                regulations and official guidelines. Do not do anything that
                might ruin Fast Bill's public image.
              </p>
              <p className="mt-3">
                When you use the Fast Bill, you agree to follow our Privacy
                Policy. We might update these rules anytime, and it is up to you
                to check for updates. These rules, in addition to our standard
                Terms of Service, are not a replacement for them. You can check
                out all the rules anytime on the Fast Bill Privacy Policy page.
              </p>
              <p className="mt-3">
                You agree that the Fast Bill is not responsible for solving or
                getting involved in any disagreements between you and your
                customers.
              </p>
            </Section>

            {/* The Fast Bill's Rights */}
            <Section
              title="The Fast Bill's Rights"
              icon={<Shield className="w-5 h-5" />}
            >
              <p>
                The Fast Bill can stop providing Services to you at any time,
                and we may do this for the following reasons, including, but not
                limited to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>
                  If you break the law, ignore government rules, or violate our
                  Terms of Service
                </li>
                <li>
                  If you provide false or suspicious details, documents, or info
                </li>
                <li>
                  For safety reasons and to protect the Fast Bill against fraud,
                  sabotage, or threats to national security
                </li>
                <li>
                  If needed for the sake of maintenance, repairs, or upgrades
                </li>
                <li>
                  You lose control of your account, or someone else hacks it
                </li>
                <li>
                  You threaten, harass, or abuse any team member of the Fast
                  Bill or others
                </li>
                <li>
                  If the Fast Bill decides that it is necessary to stop
                  providing you with further Services for business or safety
                  reasons
                </li>
              </ul>
              <p className="mt-3">
                The Fast Bill can shut down your account or delete your content
                if you use the Service to sell illegal Products or post
                inappropriate material.
              </p>
            </Section>

            {/* Accuracy of Information */}
            <Section
              title="Accuracy of Information"
              icon={<Info className="w-5 h-5" />}
            >
              <p>
                The Fast Bill app's details are for general use only. You should
                always double-check with official sources before making
                important choices. If you rely on its information for your
                business, you do so entirely at your own risk.
              </p>
              <p className="mt-3">
                Some details on the Fast Bill might be from the past and are not
                updated. The Fast Bill can change or remove anything on its
                platform at any time. We, by no means, promise to keep all
                information on the Fast Bill's app or website up-to-date. It is
                solely the user's responsibility to regularly look for any
                updates or changes to the Fast Bill Services or any other
                information provided to you in connection with the Services.
              </p>
              <p className="mt-3">
                The Fast Bill is under no obligation to update, amend, or
                clarify information on the Fast Bill's Services or on any
                related website, including, but without any limitation to,
                pricing plans, except as and when required by law. Just because
                you don't see a specific update date on the Fast Bill's app or
                website doesn't mean all the information on the Fast Bill's app
                or related website is new or up-to-date.
              </p>
            </Section>

            {/* Warranties */}
            <Section title="Warranties" icon={<Award className="w-5 h-5" />}>
              <p>
                The Fast Bill is providing you with the software and Services
                exactly as they are. It means we do not guarantee how the app
                will work, and by agreeing to these Terms of Service, you agree
                that you will use its platform, website, or app at your own
                risk. We do not promise that the Fast Bill app is perfect,
                error-free, or aligns with any specific business need. We do not
                guarantee that the app will work without interruptions. If there
                are bugs, we do not promise to fix them immediately. While we do
                our best to keep the app secure, we do not guarantee the app is
                100% free of glitches or other system viruses. By agreeing to
                the Terms of Service, you accept the app exactly as it is built
                today, including any flaws or glitches it may currently have.
              </p>
              <p className="mt-3">
                You agree that you did not rely only on what the Fast Bill or
                its partners let you know. You have checked manually and
                verified Fast Bill's Services & claims yourself. It is your own
                job to decide if the information, advice, and Services you find
                on the Fast Bill or the internet are accurate and useful.
              </p>
              <p className="mt-3">
                All other warranties, whether legal or implied, including, but
                not limited to, any sort of merchantability warranties or
                specific usability, are excluded in connection with the use of
                Fast Bill's Services.
              </p>
              <p className="mt-3">
                You, as a user, represent and warrant that:
              </p>
              <p className="mt-2">
                You are fully responsible for the items you sell, their prices,
                taxes, and any descriptions. If you run a promotion, it is your
                responsibility, and not Fast Bill's. You are entirely
                responsible for creating your own store's rules, including your
                return and refund policies, and you must clearly display all
                these to your buyers. You must clearly state in your rules and
                regulations that your customers are buying from you, and not
                from the Fast Bill. The Fast Bill is simply providing you with
                the software/platform/app to run your store, so the Fast Bill is
                not liable for any issues between you and your customers.
              </p>
            </Section>

            {/* Exclusions of Liability */}
            <Section
              title="Exclusions of Liability"
              icon={<AlertCircle className="w-5 h-5" />}
            >
              <p>
                No matter what happens, the Fast Bill and its team will not pay
                for any of your indirect or business losses. This includes lost
                profits, data, or damages caused by hacked passwords, tech
                glitches, or external issues. Despite any other rules regarding
                this written anywhere else in these documents, this specific
                rule overrides all of them. The Fast Bill and its team members
                will never take responsibility for paying you money or
                compensating you for your losses. The Fast Bill will not pay for
                "domino effect" losses, e.g., if the software is down for an
                hour and you lose a business deal. We will also not pay for any
                damage to your business reputation. If someone hacks into your
                account because you lost or shared your password, Fast Bill is
                not responsible. We are not responsible for technical issues,
                broken devices, or internet/power outages that might prevent you
                from accessing the app or software.
              </p>
              <p className="mt-3">
                If you face issues because of your internet provider, telecom
                company, hosting server, or any other software/hardware you use,
                the Fast Bill will not compensate you. If someone else accesses
                and uses your Fast Bill account, with or without your
                permission, Fast Bill is not liable for any resulting damages.
                If your device is stolen or your password/account details are
                lost and misused by someone else, Fast Bill takes no
                responsibility for the compromised data or hardware. If the Fast
                Bill is forced to block your access to the app due to new laws,
                government regulations, or orders from authorities, the Fast
                Bill authority is not responsible for any losses you suffer
                because you can not use the Fast Bill website, app, Services,
                software, or platform.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mt-4">
                <p className="text-sm text-red-700 font-semibold">
                  NO MATTER WHAT GOES WRONG, WHETHER YOU LOSE DATA, EXPERIENCE A
                  SOFTWARE GLITCH, OR SUFFER BUSINESS LOSSES BECAUSE THE FAST
                  BILL APP STOPPED WORKING, FAST BILL AND ITS TEAM CANNOT BE
                  SUED OR FORCED TO PAY YOU ANYTHING. EVEN IF ANOTHER PART OF
                  THE CONTRACT SEEMS TO SAY OTHERWISE, THIS SPECIFIC RULE
                  PREVAILS. THIS COVERS ALL TYPES OF LEGAL CLAIMS, WHETHER IT IS
                  A CONTRACT, A MISTAKE/ACCIDENT, OR ANY OTHER LEGAL DISPUTE.
                </p>
              </div>
              <p className="mt-3">
                The Fast Bill will do its best to keep the app running smoothly,
                but we cannot and do not promise it will be perfect. The app
                might go offline briefly for routine updates or maintenance. We
                do not guarantee the app will be 100% free of bugs, glitches, or
                computer viruses. While we use industry-standard security to
                protect your data, we cannot guarantee that hackers will never
                break through. If the app stops working, we promise to work as
                quickly as possible to get it running. This clause legally
                protects the Fast Bill from being sued if you experience
                unexpected errors, temporary service outages, or security
                breaches.
              </p>
              <p className="mt-3">
                You are entirely responsible for the data you enter into the
                Fast Bill software. If your business loses money, makes a tax
                mistake, or has a computer error because of incorrect or
                incomplete information you put into the app, you cannot sue Fast
                Bill for those losses. It is your responsibility to verify the
                invoices, reports, and calculations to make sure they are
                accurate and complete before sending them to your customers or
                the Government.
              </p>
            </Section>

            {/* Third Party Services */}
            <Section
              title="Third Party Services"
              icon={<Globe className="w-5 h-5" />}
            >
              <p>
                The Fast Bill can connect you to other third-party apps or
                websites, but the Fast Bill team is not responsible for how
                these external services work. If you use a link displayed on any
                of the Fast Bill platforms and have a bad experience on a
                third-party resource, Fast Bill cannot be blamed.
              </p>
              <p className="mt-3">
                The Fast Bill is not responsible for any third-party websites,
                tools, or services that you access through our platform. If you
                use external materials or websites (like a payment gateway) and
                they cause issues or data loss, the Fast Bill will not be held
                legally or financially responsible. Before using any third-party
                tool, software, or platform, you must read their rules and
                privacy policies. If you have a query, issue, or complaint about
                that external product, you have to contact the specific company,
                not Fast Bill.
              </p>
            </Section>

            {/* Viruses */}
            <Section title="Viruses" icon={<AlertCircle className="w-5 h-5" />}>
              <p>
                If you intentionally damage the Fast Bill systems with malware
                or hack into the servers without permission, you are breaking
                the law. If you do this, you commit a criminal offence under the
                Information Technology Act, 2000. We have the complete authority
                to permanently ban you, report you, reveal your identity to the
                police, and immediately cancel your account.
              </p>
              <p className="mt-3">
                If your computer, phone, or data gets infected with a virus,
                hacked, or damaged because you used the Fast Bill app or
                downloaded something from us, Fast Bill is not legally or
                financially responsible for your losses.
              </p>
              <p className="mt-3">
                You should use your own virus protection software. The Fast Bill
                does not guarantee that any files you download from its platform
                or website will be completely free of viruses, worms, Trojan
                horses, or other harmful code that might have destructive
                properties.
              </p>
            </Section>

            {/* Cancellations */}
            <Section
              title="Cancellations"
              icon={<XCircle className="w-5 h-5" />}
            >
              <p>
                Your cancellation of a monthly or yearly subscription to the
                Fast Bill Services of paid plans shall be governed by the Fast
                Bill Cancellation Policy available at https://
              </p>
            </Section>

            {/* Intellectual Property */}
            <Section
              title="Intellectual Property"
              icon={<Scale className="w-5 h-5" />}
            >
              <p>
                You only get to use the Fast Bill software, but you don't own
                it. All logos, designs, the code, and the software itself belong
                entirely to Fast Bill or its partners. You are simply paying for
                the permission to use the app or software to run your business.
                By using the app or software, you do not gain any legal rights,
                copyrights, or ownership over any part of the product.
              </p>
              <p className="mt-3">
                You are allowed to view, print, or use Fast Bill's information
                for your own personal use, as long as it is not for making
                money. You cannot reproduce, distribute, republish, transmit,
                adapt, modify, or sell Fast Bill's content without prior written
                permission. You may view, print, or use the Fast Bill's content
                for personal, non-commercial use only, provided you do not
                modify the content and you retain all copyright notices and
                other proprietary notices contained in the content.
              </p>
              <p className="mt-3">
                You cannot claim that you own the Fast Bill, its features, or
                its technology. You are not allowed to break apart, change,
                copy, or try to figure out the Fast Bill software's underlying
                code. You cannot let anyone else alter or tamper with the app or
                software on your behalf. You must use the software exactly as
                intended.
              </p>
              <p className="mt-3">
                By acknowledging these Terms of Service, you agree not to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>
                  converting the machine-readable software back into source
                  code;
                </li>
                <li>study how the app works by testing it;</li>
                <li>try to figure out or rebuild its original instructions;</li>
                <li>
                  alter or tweak the software in any way without prior written
                  permission from Fast Bill.
                </li>
              </ul>
            </Section>

            {/* Content */}
            <Section title="Content" icon={<Database className="w-5 h-5" />}>
              <p>
                The Fast Bill does not claim any intellectual Property Rights
                over the Content you provide on the Store. Only you keep the
                ownership of everything you upload.
              </p>
              <p className="mt-3">
                When you make your Store public, you give your customers and us
                permission to view and use those details.
              </p>
              <p className="mt-3">
                We are allowed to review and even delete your uploaded content
                if we need to, though we don't have to. You are completely
                responsible for making sure your content complies with any
                applicable laws or regulations locally.
              </p>
              <p className="mt-3">
                Though you keep ownership of your Content, you give Fast Bill
                the free permission to use, display, and promote your Store's
                name, logos, trademarks, and product pictures anywhere in the
                world to promote its own Services.
              </p>
            </Section>

            {/* Indemnification */}
            <Section
              title="Indemnification"
              icon={<Shield className="w-5 h-5" />}
            >
              <p>
                If the Fast Bill gets sued or loses money because of something
                you did, you promise to cover the loss, legal fees, and
                penalties. If someone sues the Fast Bill over a problem you
                caused, you have to defend the Fast Bill in court. If the
                information or Content you put on the platform causes trouble
                for anyone else, you take the blame.
              </p>
              <p className="mt-3">
                If your customers sue the Fast Bill because you failed to
                fulfill an order or complete a transaction, you are responsible
                for it. If you break data privacy laws, commit fraud, misconduct
                wilfully, or violate any of these Terms of Service, you will be
                responsible for any resulting damage. By agreeing to these Terms
                of Service, you acknowledge that you bear the entire legal and
                financial risk for how you use the Fast Bill.
              </p>
            </Section>

            {/* Waiver */}
            <Section title="Waiver" icon={<CheckCircle className="w-5 h-5" />}>
              <p>
                If the regulatory body or a specific law decides any part of
                these Terms of Service is invalid, void, or illegal, the rest of
                the Terms of Service will continue to apply to you. Only the
                illegal or unenforceable piece is just ignored.
              </p>
            </Section>

            {/* Force Majeure */}
            <Section title="Force Majeure" icon={<Clock className="w-5 h-5" />}>
              <p>
                For purposes of these Terms of Service, "Force Majeure Event"
                means any sudden, unexpected, or uncontrollable emergency of
                "Act of God'. If an unavoidable, major disaster happens that is
                completely out of your control, including war, natural
                disasters, sudden Governmental shutdowns, or massive internet
                outages, you are excused from fulfilling your contractual
                duties.
              </p>
              <p className="mt-3">
                In such cases, you won't be penalized for not doing your job
                under this agreement. However, you need to report right away
                what happened, how it stops you from fulfilling your duties, and
                how long you think it will last. You must keep the Fast Bill
                updated as things change.
              </p>
            </Section>

            {/* Relationship of the Parties */}
            <Section
              title="Relationship of the Parties"
              icon={<Users className="w-5 h-5" />}
            >
              <p>
                Using the Fast Bill does not make you an employee, partner, or
                agent of the company. You are simply a customer using the
                software, and you do not represent the Fast Bill company in any
                way.
              </p>
            </Section>

            {/* Assignment */}
            <Section
              title="Assignment"
              icon={<TrendingUp className="w-5 h-5" />}
            >
              <p>
                You cannot hand over your Fast Bill account or credentials to
                someone else or sell your business without notifying the
                authority and obtaining written permission from us. However, the
                Fast Bill is allowed to transfer its side of the agreement (if
                the company is bought or changes ownership) to anyone the
                authority chooses.
              </p>
            </Section>

            {/* Governing Law and Jurisdiction */}
            <Section
              title="Governing Law and Jurisdiction"
              icon={<Scale className="w-5 h-5" />}
            >
              <p>
                These Terms of Service will be governed by the laws of India
                without any application of the conflict of laws principle.
              </p>
              <p className="mt-3">
                You agree that if any dispute takes place between you and the
                Fast Bill team, we will both try to solve it peacefully within
                30 days.
              </p>
              <p className="mt-3">
                If we cannot fix the problem within 30 days, either of us can
                choose to have an independent referee (an arbitrator) to make
                the final decision. The arbitrator will be chosen by the Fast
                Bill. The process will take place in Barasat, West Bengal.
                Everything will be in Bengali, English, or Hindi, and you and
                the Fast Bill must accept the arbitrator's final decision.
              </p>
            </Section>

            {/* Confidentiality */}
            <Section
              title="Confidentiality"
              icon={<Lock className="w-5 h-5" />}
            >
              <p>
                The "Confidential Information" refers to the private business
                details that you enter, upload, or give access to Fast Bill.
                This includes physical documents, digital data, or secret
                business methods. Fast Bill promises to strictly protect this
                data and take all necessary steps to prevent it from being
                misused or stolen. Fast Bill will keep your data safe except in
                situations where they are legally allowed to disclose it. Though
                your legal document continues with a list of exceptions, these
                normally include court orders or laws, and providing services.
              </p>
              <p className="mt-3">
                If a government authority or a court legally forces us to hand
                over the information
              </p>
              <p className="mt-1">
                If we need to share it with trusted partners like payment
                processors and cloud hosts to make the app work properly
              </p>
              <p className="mt-3">
                These Terms of Service will also list the exact situations where
                sharing your data is required:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>
                  If the information becomes public on its own (without any
                  fault of Fast Bill)
                </li>
                <li>
                  If Fast Bill already had the information before you shared it
                  with the team
                </li>
                <li>
                  If the Fast Bill team needs to tell the members, accountants,
                  or financial advisors (they will also maintain the
                  confidentiality)
                </li>
                <li>
                  If sharing it with a third-party partner is required to
                  provide you with the Service
                </li>
                <li>
                  If a government agency of the law forces Fast Bill to reveal
                  it
                </li>
              </ul>
              <p className="mt-3">
                If you come to know any confidential information of the Fast
                Bill, you agree that you will safeguard the same and will not
                disclose such confidential data without the prior written
                consent of the Fast Bill.
              </p>
            </Section>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, you can
                email us at info@leelija.com. If you need to send any official
                document or formal notice to Fast Bill, kindly send them to the
                details given below:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <p className="font-semibold text-gray-900">
                  Leelija Web Solutions Private Limited
                </p>
                <p className="text-gray-600">Taki Road, Bamunmura, Barasat,</p>
                <p className="text-gray-600">West Bengal, India 700125</p>
              </div>
              <p className="text-gray-600 mb-2">
                Send any official mail or notices to the address written in this
                agreement. If either of us shifts to another place, we must let
                the other know about it. A notice is considered "delivered" on
                the exact day it is received.
              </p>
              <p className="text-gray-600 mt-3">
                The Fast Bill may call, text, or email you using the details you
                provided. You are entirely responsible for keeping your contact
                information up-to-date. An email or text sent by Fast Bill
                counts as an official written notice. It is considered legally
                "Delivered" as soon as it leaves Fast Bill's outgoing mail or
                message system.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a
                    href="mailto:info@leelija.com"
                    className="text-blue-600 hover:underline"
                  >
                    info@leelija.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Barasat, Kolkata - 700125</span>
                </div>
              </div>
            </div>

            {/* Cumulative Rights */}
            <Section
              title="Cumulative Rights"
              icon={<TrendingUp className="w-5 h-5" />}
            >
              <p>
                The rights of the Fast Bill provided in these Terms of Service
                are not exclusive, but are cumulative upon all other rights to
                the full extent allowed by law.
              </p>
            </Section>

            {/* Cancellation & Termination */}
            <Section
              title="Cancellation & Termination"
              icon={<XCircle className="w-5 h-5" />}
            >
              <p>
                You can cancel your Fast Bill account at any time by reaching
                out to the Fast Bill support team and following their
                instructions.
              </p>
              <p className="mt-3">
                Once your account is closed, you can no longer log in or use any
                of the Fast Bill Services. You will not get any refund for any
                remaining time on your plan. You are entirely responsible for
                paying all the dues, and once you delete your business
                information, any remaining details about your online store will
                be permanently deleted from Fast Bill's system.
              </p>
              <p className="mt-3">
                Fast Bill can change, pause, or end the app or software, rules,
                or your account at any time for any reason without telling you
                first. Even if your account is closed, any dues or rules you
                broke before the account was closed still apply.
              </p>
            </Section>

            {/* Entire Withstanding */}
            <Section
              title="Entire Withstanding"
              icon={<FileText className="w-5 h-5" />}
            >
              <p>
                These terms are the complete and final agreement between you and
                Fast Bill. It replaces earlier promises, conversations, or
                agreements (whether spoken or written) you may have had with
                Fast Bill authority or team members in the past.
              </p>
            </Section>

            {/* Back to Home Link */}
            <div className="mt-8 pt-6 text-center border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, children, icon }) {
  return (
    <div
      className="mb-8 last:mb-0 scroll-mt-20"
      id={title.toLowerCase().replace(/\s+/g, "-")}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        {icon && <span className="text-blue-600">{icon}</span>}
        {title}
      </h2>
      <div className="text-gray-600 space-y-3 leading-relaxed">{children}</div>
    </div>
  );
}

function DefinitionTerm({ term, children }) {
  return (
    <div className="pl-4 border-l-2 border-blue-200">
      <span className="font-semibold text-gray-800">"{term}"</span>
      <span className="text-gray-600"> {children}</span>
    </div>
  );
}
