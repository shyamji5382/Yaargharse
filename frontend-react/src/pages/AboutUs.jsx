export default function AboutUs() {
  return (
    <div className="page about-page">
      <div className="sign-tag">About YaarGharSe</div>
      <h1 className="display about-title">
        Ghar se dur, par <span>ghar jaisa</span>
      </h1>
      <p className="about-lead">
        YaarGharSe students ko unke college/city ke aas-paas verified mess aur
        room/PG dhundne mein madad karta hai — bina broker ke, bina guesswork ke.
      </p>

      <div className="about-grid">
        <div className="about-card">
          <h3>Kya hai ye?</h3>
          <p>
            Ek jagah jahan students apne college ke nearby mess aur PG/room
            listings dekh sakte hain — naam, price, timing, cuisine, facilities
            sab kuch, bina 10 alag WhatsApp groups chhaan ke.
          </p>
        </div>

        <div className="about-card">
          <h3>Kaise kaam karta hai?</h3>
          <p>
            Mess aur room owners khud apni listing submit karte hain. Har
            listing hamari team review karti hai aur approve karne ke baad hi
            wo public listing mein dikhti hai — taaki fake ya galat entries na
            aayein.
          </p>
        </div>

        <div className="about-card">
          <h3>Kaun use kar sakta hai?</h3>
          <p>
            <strong>Students</strong> — mess/room search kar sakte hain aur
            distance ke hisaab se sort bhi.<br />
            <strong>Mess/Room Owners</strong> — apni property list kar sakte
            hain aur ek dashboard se manage kar sakte hain.
          </p>
        </div>

        <div className="about-card">
          <h3>Location-based search</h3>
          <p>
            "Sort by distance" feature se apni current location ke sabse
            paas wale mess aur rooms sabse upar dikhte hain — koi guesswork
            nahi.
          </p>
        </div>
      </div>

      <div className="about-cta">
        <p>Mess ya room dhundna hai, ya apni property list karni hai?</p>
        <div className="hero-actions">
          <a href="/messes" className="btn btn-primary">Find a Mess</a>
          <a href="/rooms" className="btn btn-outline">Find a Room</a>
        </div>
      </div>
    </div>
  );
}
