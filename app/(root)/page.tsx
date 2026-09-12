
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";

export default function Home() {

    const loggedIn = {firstName: 'Olasope'}; // Replace with your actual authentication logic
    return (
        <section className="home">
            <div className = "home-content">
                <HeaderBox
                    type="greeting"
                    title="Welcome to DaraPay"
                    subtext="Your one-stop solution for all your banking needs."
                    user={loggedIn?.firstName || 'Guest'}
                />
                <TotalBalanceBox accounts={[]} totalBanks={0} totalCurrentBalance={120000} />
            </div>
        </section>
    );
}