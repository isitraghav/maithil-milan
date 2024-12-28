export default function Faqs() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        FAQs
      </h1>

      <section className="mb-8 space-y-8">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Profile
          </h2>

          <ul className="space-y-4 list-disc pl-4">
            <li>
              <h3 className="text-lg font-medium">Photo</h3>

              <ul className="space-y-2 list-disc pl-4">
                <li>
                  Click here to upload photo. Please note: It may take up to 2
                  hours for photo validation, after which it will be visible to
                  everyone.
                </li>

                <li>
                  Click here to change photo privacy settings. Or, open your
                  profile page{">"} Edit profile{">"} Settings{">"} Photo{">"} Choose{">"} Make
                  my photo visible only to members I prefer{">"} Save.
                </li>

                <li>
                  Your photo could be Rejected as it does not comply with our
                  photo guidelines. Or it could be Under validation, in which
                  case it may take up to 24 hours to be visible to matches.
                </li>

                <li>
                  You can remove your photo(s) here. Alternatively, open your
                  profile page{">"} Click on the photo at the top of the page{">"}
                  Profile completeness{">"} Edit Profile{">"} Remove photo.
                </li>

                <li>
                  Matches with no photos feature the avatar with an option to
                  request photo. Alternatively, you can visit the profile(s) of
                  match(es) and send a photo request.
                </li>
              </ul>
            </li>

            <li>
              <h3 className="text-lg font-medium">Horoscope</h3>

              <ul className="space-y-2 list-disc pl-4">
                <li>
                  Click here to add horoscope. Fill details{">"} Generate
                  Horoscope.
                </li>

                <li>
                  Paid members with system-generated horoscopes can upgrade to
                  AstroMatch{">"} View horoscope compatibility in detail. You can
                  purchase AstroMatch here.
                </li>

                <li>
                  You can delete your horoscope by clicking here{">"} Delete icon{">"}
                  Yes.
                </li>

                <li>
                  Please log in to your account{">"} Settings icon{">"} Edit Horoscope
                 {">"} Upload Horoscope From Your Computer{">"} Choose File{">"} Upload.
                </li>
              </ul>
            </li>

            <li>
              <h3 className="text-lg font-medium">
                Delete/Deactivate Profile
              </h3>

              <ul className="space-y-2 list-disc pl-4">
                <li>
                  To delete your profile{">"} Click here{">"} Delete Profile{">"} Select
                  reason{">"} Select source{">"} Fill details{">"} Submit{">"} Enter
                  password{">"} Delete profile.
                </li>

                <li>
                  To deactivate your profile, log in to your account{">"} Go to My
                  home{">"} Settings{">"} Account settings{">"} Deactivate profile{">"} Yes,
                  I want to hide my profile{">"} Save.
                </li>

                <li>
                  My profile has been suspended. What can I do?
                </li>

                <li>Get in touch with our customer care at 8595815003.</li>
              </ul>
            </li>

            <li>
              <h3 className="text-lg font-medium">Edit Profile</h3>

              <ul className="space-y-2 list-disc pl-4">
                <li>
                  You can edit your profile by clicking here{">"} Make changes{">"}
                  Save.
                </li>

                <li>
                  You will not be able to edit profile fields like name, date of
                  birth, marital status, etc. more than once. For other changes,
                  contact us at 8595815003.
                </li>

                <li>
                  Ensure your profile is 100% complete. You can also subscribe
                  to an add-on for profile highlighter to be featured in search
                  results.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

