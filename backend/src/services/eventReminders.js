import { Resend } from 'resend';
import { getSupabase } from '../config/supabase.js';

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
function formatEventTime(startsAt){
    return new Date(startsAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}


function reminderHTML(event){
    return `
    <p> Event coming up!</p>
    <p> ${event.title} </p>
    <p> starts at: ${formatEventTime(event.starts_at)}</p>
    ${event.location ? `<p> Location: ${event.location} </p>` : '' }
    `;
    

}
export async function sendEventReminders() {

    const supabase = getSupabase();
    if(!process.env.RESEND_API_KEY){
        console.error("sum wrong with api keyyy");
        return;
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + TWO_HOURS_IN_MS);


    const response = await supabase
        .from("events")
        .select("*")
        .lte("starts_at", twoHoursFromNow.toISOString())
        .gt("starts_at",now.toISOString())
        .is("reminder_sent_at",null);
    
    if(response.error){
        console.error(response.error);
        return;
    }

    const events = response.data || [];

    for(const event of events){
        const rsvpResponse = await supabase
            .from("event_rsvps")
            .select(`
                user_id,
                users (email
                )`
            )
            .eq("event_id",event.id);
        
        if(rsvpResponse.error){
            console.error("errors when fetching rsvps");
            continue;
        }
        const rsvps = rsvpResponse.data || [];
        for(const rsvp of rsvps){
            const email = rsvp.users?.email;
            if(!email){
                console.warn(`Skipping RSVP ${rsvp.user_id}; no email found`);
                continue;
            }
            try{
                await resend.emails.send({
                    from: 'Sports Connect <onboarding@resend.dev>',
                    to: email,
                    subject: `Reminder: ${event.title} is coming up`,
                    html: reminderHTML(event),
            });
            }catch (error){
                console.error('error when sending email')
            }

        }

        const update = await supabase
            .from('events')
            .update({reminder_sent_at: new Date().toISOString()})
            .eq('id',event.id);

        if(update.error){
            console.error("could not update reminder send for event table");
        }


    }

 
}