import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Mock AI reply based on user intent
    const lastMessage = messages[messages.length - 1].content;
    
    let suggestedReply = "عفواً، هل يمكنك توضيح سؤالك؟";

    if (lastMessage.includes('تنظيف') || lastMessage.includes('بكم')) {
      suggestedReply = "أهلاً بك. سعر تنظيف الأسنان هو 250 ريال. يتوفر لدينا موعد اليوم الساعة 4:00 عصراً أو 7:00 مساءً. هل يناسبك أحدها؟";
    } else if (lastMessage.includes('الغاء') || lastMessage.includes('إلغاء')) {
      suggestedReply = "نأسف لسماع ذلك. تم إلغاء موعدك. هل ترغب في تحديد موعد آخر في يوم مختلف؟";
    } else if (lastMessage.includes('حجز') || lastMessage.includes('موعد')) {
      suggestedReply = "أهلاً بك. لحجز موعد، نحتاج لمعرفة الخدمة المطلوبة (تنظيف، تبييض، كشفية) والوقت المفضل لك (صباحاً أو مساءً).";
    }

    return NextResponse.json({ 
      success: true,
      suggestedReply,
      intent: 'booking_inquiry'
    });

  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
